package com.jibangyoung.domain.auth.support;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class PasswordResetMailService {
    private final JavaMailSender mailSender;

    @Async
    public void sendPasswordResetMail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[지방청년] 비밀번호 재설정 안내");
        message.setText(
            "아래 링크를 클릭하여 비밀번호를 재설정하세요.\n\n" +
            resetLink +
            "\n\n본 메일은 30분간 유효합니다."
        );
        mailSender.send(message);
    }
}
