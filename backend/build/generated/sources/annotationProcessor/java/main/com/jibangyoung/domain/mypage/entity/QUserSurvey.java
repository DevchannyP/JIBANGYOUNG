package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserSurvey is a Querydsl query type for UserSurvey
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserSurvey extends EntityPathBase<UserSurvey> {

    private static final long serialVersionUID = -2070764371L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserSurvey userSurvey = new QUserSurvey("userSurvey");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isFavorite = createBoolean("isFavorite");

    public final StringPath participatedAt = createString("participatedAt");

    public final StringPath resultUrl = createString("resultUrl");

    public final StringPath title = createString("title");

    public final QUserProfile user;

    public QUserSurvey(String variable) {
        this(UserSurvey.class, forVariable(variable), INITS);
    }

    public QUserSurvey(Path<? extends UserSurvey> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserSurvey(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserSurvey(PathMetadata metadata, PathInits inits) {
        this(UserSurvey.class, metadata, inits);
    }

    public QUserSurvey(Class<? extends UserSurvey> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUserProfile(forProperty("user")) : null;
    }

}

