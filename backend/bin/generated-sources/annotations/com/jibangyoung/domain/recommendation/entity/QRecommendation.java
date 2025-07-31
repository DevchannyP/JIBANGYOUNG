package com.jibangyoung.domain.recommendation.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRecommendation is a Querydsl query type for Recommendation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecommendation extends EntityPathBase<Recommendation> {

    private static final long serialVersionUID = -143181729L;

    public static final QRecommendation recommendation = new QRecommendation("recommendation");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isViewed = createBoolean("isViewed");

    public final NumberPath<Integer> policyCode = createNumber("policyCode", Integer.class);

    public final NumberPath<Integer> rank = createNumber("rank", Integer.class);

    public final NumberPath<Integer> rankGroup = createNumber("rankGroup", Integer.class);

    public final StringPath regionCode = createString("regionCode");

    public final NumberPath<Long> responseId = createNumber("responseId", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QRecommendation(String variable) {
        super(Recommendation.class, forVariable(variable));
    }

    public QRecommendation(Path<? extends Recommendation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRecommendation(PathMetadata metadata) {
        super(Recommendation.class, metadata);
    }

}

