// package com.jibangyoung.domain.auth.scheduler;

// import com.jibangyoung.domain.auth.service.TokenService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;

// @Component
// @RequiredArgsConstructor
// @Slf4j
// public class TokenCleanupScheduler {

//     private final TokenService tokenService;

//     /**
//      * 매일 새벽 3시에 만료되거나 폐기된 RefreshToken DB에서 삭제
//      */
//     @Scheduled(cron = "0 0 3 * * ?")
//     public void cleanupTokens() {
//         log.info("[토큰 정리 스케줄러] 만료/폐기된 RefreshToken을 DB에서 삭제합니다.");
//         tokenService.cleanupExpiredTokens();
//     }
// }
