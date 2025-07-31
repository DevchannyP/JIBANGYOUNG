package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserRegionScore is a Querydsl query type for UserRegionScore
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserRegionScore extends EntityPathBase<UserRegionScore> {

    private static final long serialVersionUID = 214417035L;

    public static final QUserRegionScore userRegionScore = new QUserRegionScore("userRegionScore");

    public final NumberPath<Integer> regionId = createNumber("regionId", Integer.class);

    public final NumberPath<Long> totalScore = createNumber("totalScore", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QUserRegionScore(String variable) {
        super(UserRegionScore.class, forVariable(variable));
    }

    public QUserRegionScore(Path<? extends UserRegionScore> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserRegionScore(PathMetadata metadata) {
        super(UserRegionScore.class, metadata);
    }

}

