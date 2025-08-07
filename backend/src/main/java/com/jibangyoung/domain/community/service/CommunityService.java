package com.jibangyoung.domain.community.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.OptimisticLockException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository; // UserRepository 추가
import com.jibangyoung.domain.community.dto.CommentRequestDto;
import com.jibangyoung.domain.community.dto.CommentResponseDto;
import com.jibangyoung.domain.community.dto.PostCreateRequestDto;
import com.jibangyoung.domain.community.dto.PostDetailDto;
import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.dto.PostUpdateRequestDto;
import com.jibangyoung.domain.community.dto.RegionResponseDto;
import com.jibangyoung.domain.community.entity.PostRecommendation;
import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.repository.PostRecommendationRepository;
import com.jibangyoung.domain.community.repository.PostRepository;
import com.jibangyoung.domain.community.support.S3ImageManager;
import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.mypage.repository.CommentRepository;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.RegionRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final PostRepository postRepository;
    private final RegionRepository regionRepository;
    private final CommentRepository commentRepository; // 의존성 추가
    private final UserRepository userRepository; // UserRepository 주입
    private final PostRecommendationRepository postRecommendationRepository; // PostRecommendationRepository 주입
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final S3ImageManager s3ImageManager;

    @Transactional
    public void recommendPost(Long postId, Long userId, String recommendationType) {
        int retryCount = 3;
        for (int i = 0; i < retryCount; i++) {
            try {
                performRecommendPost(postId, userId, recommendationType);
                return; // 성공 시 메서드 종료
            } catch (OptimisticLockException e) {
                if (i == retryCount - 1) {
                    throw new RuntimeException("추천 처리 중 오류가 발생했습니다. 다시 시도해주세요.", e);
                }
                // 잠시 대기 후 재시도
                try {
                    Thread.sleep(50); // 50ms 대기
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("추천 처리가 중단되었습니다.", ie);
                }
            }
        }
    }

    private void performRecommendPost(Long postId, Long userId, String recommendationType) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 사용자가 이미 이 게시글을 추천했는지 확인 (5개 중 1개만 가능)
        Optional<PostRecommendation> existingRecommendation = postRecommendationRepository.findByUserIdAndPostId(userId, postId);
        if (existingRecommendation.isPresent()) {
            // 기존 추천이 있으면 타입만 변경 (5개 중 1개만 선택 가능)
            PostRecommendation recommendation = existingRecommendation.get();
            String oldType = recommendation.getRecommendationType();
            
            // 같은 타입이면 추천 취소
            if (oldType.equals(recommendationType)) {
                postRecommendationRepository.delete(recommendation);
                post.decrementLikes();
            } else {
                // 다른 타입이면 변경 (좋아요 수는 유지)
                PostRecommendation updatedRecommendation = PostRecommendation.builder()
                        .id(recommendation.getId())
                        .user(user)
                        .post(post)
                        .recommendationType(recommendationType)
                        .build();
                postRecommendationRepository.save(updatedRecommendation);
            }
        } else {
            // 새로운 추천 저장
            PostRecommendation recommendation = PostRecommendation.builder()
                    .user(user)
                    .post(post)
                    .recommendationType(recommendationType)
                    .build();
            postRecommendationRepository.save(recommendation);
            
            // 게시글 좋아요 수 증가
            post.incrementLikes();
        }
        
        postRepository.save(post); // 변경된 likes 수를 저장
    }

    public String getUserRecommendationType(Long postId, Long userId) {
        Optional<PostRecommendation> recommendation = postRecommendationRepository.findByUserIdAndPostId(userId, postId);
        return recommendation.map(PostRecommendation::getRecommendationType).orElse(null);
    }

    // 지역 코드
    // 지역 시도
    // 지역 군구 - (없으면 시도)
    @Transactional
    public List<RegionResponseDto> getAllRegionsBoard() {
        List<Region> regions = regionRepository.findAllByOrderByRegionCode();

        Map<String, Map<String, RegionResponseDto>> regionMap = new LinkedHashMap<>();

        // 시도 , 군구1 + 군구2 데이터 통합
        // 시도 : 경기도
        // 군구 : 수원시 팔달구
        for (Region region : regions) {
            if (region.getRegionCode() == 99999) {
                continue;
            }
            String sido = region.getSido();
            String guGun1 = region.getGuGun1();

            String finalGuGun = (guGun1 == null || guGun1.trim().isEmpty()) ? sido : guGun1;
            finalGuGun += (region.getGuGun2() == null || region.getGuGun2().trim().isEmpty()) ? ""
                    : " " + region.getGuGun2();

            regionMap.putIfAbsent(sido, new HashMap<>());
            Map<String, RegionResponseDto> guGunMap = regionMap.get(sido);

            RegionResponseDto dto = RegionResponseDto.builder()
                    .regionCode(region.getRegionCode())
                    .sido(sido)
                    .guGun(finalGuGun)
                    .build();
            guGunMap.put(finalGuGun, dto);
        }

        return regionMap.values().stream()
                .flatMap(guGunMap -> guGunMap.values().stream())
                .sorted(Comparator.comparing(RegionResponseDto::getRegionCode))
                .collect(Collectors.toList());
    }

    // 카테고리가 정착후기인 게시글 중,
    // 추천 수 기준 상위 10개를 내림차 순 조회.
    @Transactional
    public List<PostListDto> getTopReviews() {
        return postRepository
                .findTop10ByCategoryOrderByLikesDesc(Posts.PostCategory.REVIEW)
                .stream()
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }

    // 최근 since 시점 이후 작성된 게시글 중,
    // 추천 수 기준 상위 10개를 내림차 순 조회.
    @Transactional
    public List<PostListDto> getRecentTop10(LocalDateTime since) {
        return postRepository.findTop10ByCreatedAtAfterOrderByLikesDesc(since).stream()
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PostListDto> getCachedTop10ByPeriod(String period) {
        String key = switch (period.toLowerCase()) {
            case "week" -> "top10WeeklyPosts";
            case "month" -> "top10MonthlyPosts";
            default -> "top10TodayPosts"; // 기본값
        };
        return getCachedPostList(key);
    }

    // Redis에 저장된 게시글 리스트를 가져와 PostListDto 리스트로 변환
    private List<PostListDto> getCachedPostList(String cacheKey) {
        Object raw = redisTemplate.opsForValue().get(cacheKey);
        if (raw == null) {
            return Collections.emptyList();
        }
        @SuppressWarnings("unchecked")
        List<Object> rawList = (List<Object>) raw;
        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, PostListDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public Page<PostListDto> getPopularPostsPage(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Posts> postPage = postRepository.findByLikesGreaterThanEqualOrderByIdDesc(10, pageable);
        return postPage.map(PostListDto::from); // ✅ now it's correct
    }

    @Transactional
    public Page<PostListDto> getPostsByRegion(String regionCode, int page, int size, String category, String search,
            String searchType) {
        int pageIndex = page - 1; // PageRequest는 0-based
        Pageable pageable = PageRequest.of(pageIndex, size);
        Page<Posts> postPage;

        Long regionId = Long.parseLong(regionCode);

        if (search != null && !search.trim().isEmpty()) {
            // 검색어가 있는 경우
            switch (searchType) {
                case "title":
                    postPage = postRepository.findByRegionIdAndTitleContainingOrderByCreatedAtDesc(regionId, search,
                            pageable);
                    break;
                case "content":
                    postPage = postRepository.findByRegionIdAndContentContainingOrderByCreatedAtDesc(regionId, search,
                            pageable);
                    break;
                case "author":
                    postPage = postRepository.findByRegionIdAndTitleContainingOrderByCreatedAtDesc(regionId, search,
                            pageable); // 임시
                    break;
                default:
                    postPage = postRepository.findByRegionIdOrderByCreatedAtDesc(regionId, pageable);
                    break;
            }
        } else if (category == null || category.equals("all")) {
            postPage = postRepository.findByRegionIdOrderByCreatedAtDesc(regionId, pageable);
        } else if (category.equals("popular")) {
            // 인기글은 지역별로 필터링하면서 좋아요 수 기준으로 정렬
            postPage = postRepository.findByRegionIdAndLikesGreaterThanEqualOrderByCreatedAtDesc(regionId, 10,
                    pageable);
        } else {
            // 특정 카테고리 필터링
            Posts.PostCategory postCategory = Posts.PostCategory.valueOf(category.toUpperCase());
            postPage = postRepository.findByRegionIdAndCategoryOrderByCreatedAtDesc(regionId, postCategory, pageable);
        }
        return postPage.map(PostListDto::from);
    }

    @Transactional(readOnly = true)
    public PostDetailDto getPostDetail(Long postId) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));
        
        // 조회수 증가는 별도 트랜잭션에서 처리
        increaseViewCount(postId);
        
        // 작성자 정보 조회
        User author = userRepository.findById(post.getUserId())
                .orElse(null);
        String authorName = (author != null) ? author.getUsername() : "알 수 없음";
        
        return PostDetailDto.fromWithAuthor(post, authorName);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void increaseViewCount(Long postId) {
        try {
            Posts post = postRepository.findById(postId).orElse(null);
            if (post != null) {
                post.increaseViews();
                postRepository.save(post);
            }
        } catch (OptimisticLockException e) {
            // 조회수 증가 실패 시 무시 (조회수는 정확성보다 성능이 중요)
            // 로그만 남기고 예외는 전파하지 않음
        }
    }

    @Transactional
    public void write(PostCreateRequestDto request) {
        String content = request.getContent();

        // 본문에서 사용된 temp 이미지 key 추출
        List<String> usedTempKeys = s3ImageManager.extractUsedTempImageKeys(content);

        // 모든 temp/ 이미지 key 조회
        List<String> allTempKeys = s3ImageManager.getAllTempImageKeys();

        // 사용된 temp 이미지 post-images/로 복사
        Map<String, String> urlMapping = new HashMap<>();
        for (String tempKey : usedTempKeys) {
            String newKey = tempKey.replace("temp/", "post-images/");
            s3ImageManager.copyObject(tempKey, newKey);
            s3ImageManager.deleteObject(tempKey);

            String oldUrl = s3ImageManager.getPublicUrl(tempKey);
            String newUrl = s3ImageManager.getPublicUrl(newKey);
            urlMapping.put(oldUrl, newUrl);
        }

        // 4. content temp 이미지 URL, post-images/ URL로 변경
        for (Map.Entry<String, String> entry : urlMapping.entrySet()) {
            content = content.replace(entry.getKey(), entry.getValue());
        }

        // 사용되지 않은 temp 이미지 삭제
        allTempKeys.stream()
                .filter(key -> !usedTempKeys.contains(key))
                .forEach(s3ImageManager::deleteObject);

        // 썸네일 재추출 (post-images로 치환된 content 기준)
        String thumbnailUrl = Optional.ofNullable(
                s3ImageManager.extractFirstImageUrl(content))
                .orElse("https://jibangyoung-s3.s3.ap-northeast-2.amazonaws.com/main/%ED%9B%84%EB%8B%88.png");

        // 게시글 저장
        Posts post = request.toEntity(thumbnailUrl, content);
        postRepository.save(post);
    }

    // 게시글 수정
    @Transactional
    public void updatePost(Long postId, Long userId, PostUpdateRequestDto request) {
        int retryCount = 3;
        for (int i = 0; i < retryCount; i++) {
            try {
                performUpdatePost(postId, userId, request);
                return; // 성공 시 메서드 종료
            } catch (OptimisticLockException e) {
                if (i == retryCount - 1) {
                    throw new RuntimeException("게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.", e);
                }
                // 잠시 대기 후 재시도
                try {
                    Thread.sleep(50); // 50ms 대기
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("게시글 수정이 중단되었습니다.", ie);
                }
            }
        }
    }

    private void performUpdatePost(Long postId, Long userId, PostUpdateRequestDto request) {
        // 게시글 조회
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        // 작성자 확인
        if (post.getUserId() != userId) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        String content = request.getContent();

        // 본문에서 사용된 temp 이미지 key 추출
        List<String> usedTempKeys = s3ImageManager.extractUsedTempImageKeys(content);

        // 모든 temp/ 이미지 key 조회
        List<String> allTempKeys = s3ImageManager.getAllTempImageKeys();

        // 사용된 temp 이미지 post-images/로 복사
        Map<String, String> urlMapping = new HashMap<>();
        for (String tempKey : usedTempKeys) {
            String newKey = tempKey.replace("temp/", "post-images/");
            s3ImageManager.copyObject(tempKey, newKey);
            s3ImageManager.deleteObject(tempKey);

            String oldUrl = s3ImageManager.getPublicUrl(tempKey);
            String newUrl = s3ImageManager.getPublicUrl(newKey);
            urlMapping.put(oldUrl, newUrl);
        }

        // content temp 이미지 URL, post-images/ URL로 변경
        for (Map.Entry<String, String> entry : urlMapping.entrySet()) {
            content = content.replace(entry.getKey(), entry.getValue());
        }

        // 사용되지 않은 temp 이미지 삭제
        allTempKeys.stream()
                .filter(key -> !usedTempKeys.contains(key))
                .forEach(s3ImageManager::deleteObject);

        // 썸네일 재추출 (post-images로 치환된 content 기준)
        String thumbnailUrl = Optional.ofNullable(
                s3ImageManager.extractFirstImageUrl(content))
                .orElse("https://jibangyoung-s3.s3.ap-northeast-2.amazonaws.com/main/%ED%9B%84%EB%8B%88.png");

        // 게시글 업데이트
        post.updatePost(
                request.getTitle(),
                content,
                Posts.PostCategory.valueOf(request.getCategory()),
                request.isNotice(),
                request.isMentorOnly(),
                thumbnailUrl
        );
        
        // 명시적으로 저장
        postRepository.save(post);
    }

    @Transactional
    public Page<PostListDto> getPostsByRegionPopular(String regionCode, int page, int size) {
        int pageIndex = page - 1; // PageRequest는 0-based
        Pageable pageable = PageRequest.of(pageIndex, size);
        Page<Posts> postPage = postRepository
                .findByRegionIdAndLikesGreaterThanEqualOrderByCreatedAtDesc(Long.valueOf(regionCode), 10, pageable);
        return postPage.map(PostListDto::from);
    }

    // 인기 후기
    @Transactional
    public List<PostListDto> getTopReviewPosts() {
        String redisKey = "top10ReviewPosts";

        // 1️⃣ Redis 캐시에서 바로 조회
        Object raw = redisTemplate.opsForValue().get(redisKey);
        if (raw == null) {
            return Collections.emptyList(); // 캐시 없으면 빈 리스트 반환
        }

        @SuppressWarnings("unchecked")
        List<Object> rawList = (List<Object>) raw;
        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, PostListDto.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostListDto> getNotices() {
        return postRepository.findTop2ByIsNoticeTrueOrderByCreatedAtDesc()
                .stream()
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }

    // 지역별 공지사항 조회 (갯수 제한 없음)
    @Transactional(readOnly = true)
    public List<PostListDto> getNoticesByRegion(Long regionId) {
        return postRepository.findByRegionIdAndIsNoticeTrueOrderByCreatedAtDesc(regionId)
                .stream()
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }

    // 지역별 인기글 조회
    @Transactional(readOnly = true)
    public List<PostListDto> getPopularPostsByRegion(Long regionId) {
        return postRepository.findTop10ByRegionIdOrderByLikesDesc(regionId)
                .stream()
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }

    // 댓글 관련 로직 추가

    @Transactional(readOnly = true)
    public List<CommentResponseDto> findCommentsByPostId(Long postId) {
        // 1. 게시글 존재 여부 확인
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다. id=" + postId);
        }

        // 2. 게시글의 모든 댓글을 가져옵니다.
        List<Comment> comments = commentRepository.findByTargetPostId(postId);
        Map<Long, CommentResponseDto> commentDtoMap = new HashMap<>();
        List<CommentResponseDto> rootComments = new ArrayList<>();

        // 3. 모든 댓글을 DTO로 변환하고 Map에 저장
        for (Comment comment : comments) {
            CommentResponseDto dto = new CommentResponseDto(comment, new ArrayList<>());
            commentDtoMap.put(comment.getId(), dto);
        }

        // 4. 대댓글을 부모 댓글의 replies 리스트에 추가
        for (Comment comment : comments) {
            if (comment.getParent() != null) {
                CommentResponseDto parentDto = commentDtoMap.get(comment.getParent().getId());
                if (parentDto != null) {
                    parentDto.getReplies().add(commentDtoMap.get(comment.getId()));
                }
            } else {
                rootComments.add(commentDtoMap.get(comment.getId()));
            }
        }
        return rootComments;
    }

    @Transactional
    public void saveComment(Long postId, Long userId, String author, CommentRequestDto requestDto) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. id=" + postId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id=" + userId));

        Comment parent = null;
        if (requestDto.getParentId() != null) {
            parent = commentRepository.findById(requestDto.getParentId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("부모 댓글을 찾을 수 없습니다. id=" + requestDto.getParentId()));
        }

        Comment comment = Comment.builder()
                .user(user)
                .content(requestDto.getContent())
                .targetPostId(post.getId())
                .targetPostTitle(post.getTitle())
                .parent(parent)
                .build();

        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다. id=" + commentId));

        // 댓글 작성자만 삭제할 수 있도록 권한 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }
}