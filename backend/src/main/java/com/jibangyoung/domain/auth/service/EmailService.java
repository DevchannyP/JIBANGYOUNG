package com.jibangyoung.domain.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Async
    public void sendAuthCodeMail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            message.setSubject("[지방청년] 회원가입 인증코드");
            message.setRecipients(MimeMessage.RecipientType.TO, to);
            message.setText("인증코드: " + code + "\n(유효시간: 5분)");
            mailSender.send(message);
        } catch (Exception e) {
            // 예외 로깅
        }
    }
}
