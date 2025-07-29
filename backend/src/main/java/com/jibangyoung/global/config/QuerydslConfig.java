// src/main/java/com/jibangyoung/global/config/QuerydslConfig.java

package com.jibangyoung.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

/**
 * QueryDSL JPAQueryFactory 빈 등록
 */
@Configuration
public class QuerydslConfig {
    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager entityManager) {
        return new JPAQueryFactory(entityManager);
    }
}
