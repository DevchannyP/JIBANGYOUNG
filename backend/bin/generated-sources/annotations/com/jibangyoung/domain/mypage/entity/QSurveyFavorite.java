package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSurveyFavorite is a Querydsl query type for SurveyFavorite
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSurveyFavorite extends EntityPathBase<SurveyFavorite> {

    private static final long serialVersionUID = 911814846L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSurveyFavorite surveyFavorite = new QSurveyFavorite("surveyFavorite");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isFavorite = createBoolean("isFavorite");

    public final DateTimePath<java.time.LocalDateTime> participatedAt = createDateTime("participatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> surveyId = createNumber("surveyId", Long.class);

    public final StringPath title = createString("title");

    public final com.jibangyoung.domain.auth.entity.QUser user;

    public QSurveyFavorite(String variable) {
        this(SurveyFavorite.class, forVariable(variable), INITS);
    }

    public QSurveyFavorite(Path<? extends SurveyFavorite> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSurveyFavorite(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSurveyFavorite(PathMetadata metadata, PathInits inits) {
        this(SurveyFavorite.class, metadata, inits);
    }

    public QSurveyFavorite(Class<? extends SurveyFavorite> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.jibangyoung.domain.auth.entity.QUser(forProperty("user")) : null;
    }

}

