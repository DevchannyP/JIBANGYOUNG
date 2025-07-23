package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserAlert is a Querydsl query type for UserAlert
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserAlert extends EntityPathBase<UserAlert> {

    private static final long serialVersionUID = -1607723607L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserAlert userAlert = new QUserAlert("userAlert");

    public final StringPath createdAt = createString("createdAt");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isRead = createBoolean("isRead");

    public final StringPath message = createString("message");

    public final StringPath region = createString("region");

    public final QUserProfile user;

    public QUserAlert(String variable) {
        this(UserAlert.class, forVariable(variable), INITS);
    }

    public QUserAlert(Path<? extends UserAlert> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserAlert(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserAlert(PathMetadata metadata, PathInits inits) {
        this(UserAlert.class, metadata, inits);
    }

    public QUserAlert(Class<? extends UserAlert> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUserProfile(forProperty("user")) : null;
    }

}

