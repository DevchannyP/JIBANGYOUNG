// backend/src/main/java/com/jibangyoung/domain/auth/support/RefreshTokenRedis.java
package com.jibangyoung.domain.auth.support;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshTokenRedis implements Serializable {
    private String token;
    private String username;
    private LocalDateTime expiresAt;
    private boolean revoked;

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}
