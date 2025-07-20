plugins {
    id("java")
    id("application")
    id("org.springframework.boot") version "3.5.3" // ✅ 버전 업!
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
    // --- Spring Core ---
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.boot:spring-boot-starter-batch")
    implementation("org.springframework.boot:spring-boot-starter-mail")

    // --- Mail: jakarta.mail 명시적 추가 (충돌방지) ---
    implementation("com.sun.mail:jakarta.mail:2.0.1") {
        exclude(group = "javax.mail", module = "mail")
        exclude(group = "javax.activation", module = "activation")
    }
    implementation("com.sun.activation:jakarta.activation:2.0.1") {
        exclude(group = "javax.activation", module = "activation")
    }

    // --- OAuth2 & Security ---
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")

    // --- JWT ---
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

    // --- QueryDSL ---
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.0.0:jakarta")

    // --- 기타 ---
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")
    implementation("software.amazon.awssdk:s3:2.25.22")
    implementation("co.elastic.clients:elasticsearch-java:8.12.0")
    implementation("net.javacrumbs.shedlock:shedlock-spring:5.7.0")
    implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:5.7.0")
    implementation("org.jsoup:jsoup:1.17.1")
    implementation("com.google.guava:guava:32.1.3-jre")
    implementation("commons-codec:commons-codec:1.16.1")
    implementation("org.bouncycastle:bcprov-jdk18on:1.77")

    // --- DB ---
    runtimeOnly("mysql:mysql-connector-java:8.0.33")

    // --- Lombok ---
    compileOnly("org.projectlombok:lombok:1.18.30")
    annotationProcessor("org.projectlombok:lombok:1.18.30")

    // --- JPA Annotation 오류 방지 ---
    compileOnly("jakarta.persistence:jakarta.persistence-api:3.1.0")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api:3.1.0")

    // --- Test ---
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito:mockito-core:5.11.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

val mainClassFqcn = "com.jibangyoung.JibangyoungApplication"

application {
    mainClass.set(mainClassFqcn)
}

tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootJar> {
    mainClass.set(mainClassFqcn)
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(listOf("-parameters"))
}

tasks.test {
    useJUnitPlatform()
}
