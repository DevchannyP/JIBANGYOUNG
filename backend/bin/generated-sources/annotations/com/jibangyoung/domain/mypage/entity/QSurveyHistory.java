package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSurveyHistory is a Querydsl query type for SurveyHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSurveyHistory extends EntityPathBase<SurveyHistory> {

    private static final long serialVersionUID = -2125590222L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSurveyHistory surveyHistory = new QSurveyHistory("surveyHistory");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isFavorite = createBoolean("isFavorite");

    public final DateTimePath<java.time.LocalDateTime> participatedAt = createDateTime("participatedAt", java.time.LocalDateTime.class);

    public final StringPath resultUrl = createString("resultUrl");

    public final StringPath title = createString("title");

    public final com.jibangyoung.domain.auth.entity.QUser user;

    public QSurveyHistory(String variable) {
        this(SurveyHistory.class, forVariable(variable), INITS);
    }

    public QSurveyHistory(Path<? extends SurveyHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSurveyHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSurveyHistory(PathMetadata metadata, PathInits inits) {
        this(SurveyHistory.class, metadata, inits);
    }

    public QSurveyHistory(Class<? extends SurveyHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.jibangyoung.domain.auth.entity.QUser(forProperty("user")) : null;
    }

}

