plugins {
    id("java")
    id("application")
    id("org.springframework.boot") version "3.2.4"
    id("io.spring.dependency-management") version "1.1.4"
}

group = "com.jibangyoung"
version = "1.0.0"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Web & Security
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

    // OAuth2
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")

    // JPA + QueryDSL (annotationProcessor 적용!)
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.0.0:jakarta")

    // JPA Entity 오류 방지
    compileOnly("jakarta.persistence:jakarta.persistence-api:3.1.0")

    // Redis, Swagger, AWS, Elasticsearch 등
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")
    implementation("software.amazon.awssdk:s3:2.25.22")
    implementation("co.elastic.clients:elasticsearch-java:8.12.0")

    // Batch + Scheduler
    implementation("org.springframework.boot:spring-boot-starter-batch")
    implementation("net.javacrumbs.shedlock:shedlock-spring:5.7.0")
    implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:5.7.0")

    // 유틸
    implementation("org.jsoup:jsoup:1.17.1")
    implementation("com.google.guava:guava:32.1.3-jre")
    implementation("commons-codec:commons-codec:1.16.1")
    implementation("org.bouncycastle:bcprov-jdk18on:1.77")


    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.30")
    annotationProcessor("org.projectlombok:lombok:1.18.30")

    // MySQL
    runtimeOnly("mysql:mysql-connector-java:8.0.33")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito:mockito-core:5.11.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // JPA Entity 어노테이션 오류 방지 (annotationProcessor만으로 충분)
    // compileOnly("jakarta.persistence:jakarta.persistence-api:3.1.0") // 이미 위에 포함
    annotationProcessor("jakarta.persistence:jakarta.persistence-api:3.1.0")
}

// ✅ [Gradle 8.x 최신] QueryDSL Q 클래스 경로 수동 추가는 삭제
// -> 자동 생성/인식됨, sourceSets 수정 X

// 메인 클래스 설정
val mainClassFqcn = "com.jibangyoung.JibangyoungApplication"

application {
    mainClass.set(mainClassFqcn)
}

// BootJar 메인 클래스 (중복 설정도 가능하나, application만으로 충분)
tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootJar> {
    mainClass.set(mainClassFqcn)
}

// Java 컴파일 옵션
tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(listOf("-parameters"))
}

// 테스트 플랫폼 설정
tasks.test {
    useJUnitPlatform()
}
