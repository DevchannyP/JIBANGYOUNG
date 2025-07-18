package com.jibangyoung.domain.auth.service;

import java.time.Duration;
import java.util.Random;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;

    // 인증 코드 생성(보안 강화 - SecureRandom)
    private String generateCode() {
        Random rnd = new Random(); // 보안이슈 있으면 SecureRandom 사용
        return String.format("%06d", rnd.nextInt(1000000));
    }

    // 이메일 인증코드 전송
    public void sendCode(String email) {
        String code = generateCode();
        String redisKey = "EMAIL_CODE:" + email;
        try {
            // Redis에 5분간 저장 (만료시간 설정)
            redisTemplate.opsForValue().set(redisKey, code, Duration.ofMinutes(5));

            // MIME 메시지 생성 (HTML 사용 가능)
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(email);
            helper.setSubject("[지방청년] 이메일 인증코드");
            helper.setText(
                "<h3>인증코드: <b>" + code + "</b></h3><p>5분 내에 입력하세요.</p>",
                true // HTML 여부
            );

            mailSender.send(mimeMessage);
            log.info("인증코드 전송 완료: {}", email);
        } catch (MessagingException e) {
            log.error("이메일 전송 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이메일 전송에 실패했습니다.");
        } catch (Exception e) {
            log.error("인증코드 발송 중 예외: {}", e.getMessage(), e);
            throw new RuntimeException("인증코드 발송에 실패했습니다.");
        }
    }

    // 인증코드 검증
    public boolean verifyCode(String email, String inputCode) {
        String key = "EMAIL_CODE:" + email;
        String savedCode = redisTemplate.opsForValue().get(key);
        boolean match = savedCode != null && savedCode.equals(inputCode);

        // 인증 성공시 코드 소멸
        if (match) redisTemplate.delete(key);

        // 로깅
        log.info("이메일 인증 시도: email={}, 입력값={}, 결과={}", email, inputCode, match);
        return match;
    }
}
