package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRegionScore is a Querydsl query type for RegionScore
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRegionScore extends EntityPathBase<RegionScore> {

    private static final long serialVersionUID = 808266582L;

    public static final QRegionScore regionScore = new QRegionScore("regionScore");

    public final NumberPath<Integer> commentCount = createNumber("commentCount", Integer.class);

    public final NumberPath<Integer> daysToMentor = createNumber("daysToMentor", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> mentoringCount = createNumber("mentoringCount", Integer.class);

    public final NumberPath<Integer> postCount = createNumber("postCount", Integer.class);

    public final NumberPath<Float> promotionProgress = createNumber("promotionProgress", Float.class);

    public final StringPath region = createString("region");

    public final NumberPath<Integer> score = createNumber("score", Integer.class);

    public final ListPath<RegionScoreHistory, QRegionScoreHistory> scoreHistory = this.<RegionScoreHistory, QRegionScoreHistory>createList("scoreHistory", RegionScoreHistory.class, QRegionScoreHistory.class, PathInits.DIRECT2);

    public QRegionScore(String variable) {
        super(RegionScore.class, forVariable(variable));
    }

    public QRegionScore(Path<? extends RegionScore> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRegionScore(PathMetadata metadata) {
        super(RegionScore.class, metadata);
    }

}

