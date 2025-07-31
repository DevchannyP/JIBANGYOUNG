package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserActivityEvent is a Querydsl query type for UserActivityEvent
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserActivityEvent extends EntityPathBase<UserActivityEvent> {

    private static final long serialVersionUID = -1631842280L;

    public static final QUserActivityEvent userActivityEvent = new QUserActivityEvent("userActivityEvent");

    public final StringPath actionType = createString("actionType");

    public final NumberPath<Integer> actionValue = createNumber("actionValue", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath ipAddr = createString("ipAddr");

    public final StringPath lang = createString("lang");

    public final StringPath memo = createString("memo");

    public final StringPath meta = createString("meta");

    public final NumberPath<Long> parentRefId = createNumber("parentRefId", Long.class);

    public final StringPath platform = createString("platform");

    public final NumberPath<Long> refId = createNumber("refId", Long.class);

    public final NumberPath<Integer> regionId = createNumber("regionId", Integer.class);

    public final NumberPath<Integer> scoreDelta = createNumber("scoreDelta", Integer.class);

    public final StringPath status = createString("status");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final StringPath userAgent = createString("userAgent");

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QUserActivityEvent(String variable) {
        super(UserActivityEvent.class, forVariable(variable));
    }

    public QUserActivityEvent(Path<? extends UserActivityEvent> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserActivityEvent(PathMetadata metadata) {
        super(UserActivityEvent.class, metadata);
    }

}

