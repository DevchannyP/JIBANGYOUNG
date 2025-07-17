// package com.jibangyoung.domain.auth.batch;

// import java.util.List;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;
// import org.springframework.transaction.annotation.Transactional;

// import com.jibangyoung.domain.auth.entity.User;
// import com.jibangyoung.domain.auth.repository.UserRepository;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Component
// @RequiredArgsConstructor
// @Slf4j
// public class PlainPasswordMigrationService implements CommandLineRunner {

//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//     @Override
//     @Transactional
//     public void run(String... args) {
//         System.out.println("==== [PlainPasswordMigrationService 실행] 평문 비밀번호 → 해시로 일괄 변경 시작 ====");

//         List<User> users = userRepository.findAll();
//         System.out.println("users.size() = " + users.size());

//         int updated = 0;

//         for (User user : users) {
//             String password = user.getPassword();
//             System.out.println("id=" + user.getId() +
//                                ", username=" + user.getUsername() +
//                                ", password=" + password);

//             if (password == null) {
//                 System.out.println(">> [WARN] 비밀번호가 null! (username: " + user.getUsername() + ")");
//                 continue;
//             } else if (password.startsWith("$2a$")) {
//                 System.out.println(">> 이미 해시된 비밀번호입니다. (username: " + user.getUsername() + ")");
//                 continue;
//             } else {
//                 String encoded = passwordEncoder.encode(password);
//                 userRepository.updatePasswordById(user.getId(), encoded);
//                 updated++;
//                 System.out.println(">> 비밀번호 해시 처리: " + encoded + " (username: " + user.getUsername() + ")");
//             }
//         }

//         System.out.println("==== 평문 비밀번호 → 해시 변경 완료! 총 " + updated + "건 변경 ====");
//     }
// }
