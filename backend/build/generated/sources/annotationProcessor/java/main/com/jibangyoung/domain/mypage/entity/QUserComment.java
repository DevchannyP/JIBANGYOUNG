package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserComment is a Querydsl query type for UserComment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserComment extends EntityPathBase<UserComment> {

    private static final long serialVersionUID = -1261003924L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserComment userComment = new QUserComment("userComment");

    public final StringPath content = createString("content");

    public final StringPath createdAt = createString("createdAt");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath targetPostTitle = createString("targetPostTitle");

    public final QUserProfile user;

    public QUserComment(String variable) {
        this(UserComment.class, forVariable(variable), INITS);
    }

    public QUserComment(Path<? extends UserComment> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserComment(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserComment(PathMetadata metadata, PathInits inits) {
        this(UserComment.class, metadata, inits);
    }

    public QUserComment(Class<? extends UserComment> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUserProfile(forProperty("user")) : null;
    }

}

