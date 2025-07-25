package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRegionScoreHistory is a Querydsl query type for RegionScoreHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRegionScoreHistory extends EntityPathBase<RegionScoreHistory> {

    private static final long serialVersionUID = 98174046L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRegionScoreHistory regionScoreHistory = new QRegionScoreHistory("regionScoreHistory");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final NumberPath<Integer> delta = createNumber("delta", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath reason = createString("reason");

    public final QRegionScore regionScore;

    public QRegionScoreHistory(String variable) {
        this(RegionScoreHistory.class, forVariable(variable), INITS);
    }

    public QRegionScoreHistory(Path<? extends RegionScoreHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRegionScoreHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRegionScoreHistory(PathMetadata metadata, PathInits inits) {
        this(RegionScoreHistory.class, metadata, inits);
    }

    public QRegionScoreHistory(Class<? extends RegionScoreHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.regionScore = inits.isInitialized("regionScore") ? new QRegionScore(forProperty("regionScore")) : null;
    }

}

