package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserProfile is a Querydsl query type for UserProfile
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserProfile extends EntityPathBase<UserProfile> {

    private static final long serialVersionUID = 1774139062L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserProfile userProfile = new QUserProfile("userProfile");

    public final DatePath<java.time.LocalDate> birthDate = createDate("birthDate", java.time.LocalDate.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final StringPath gender = createString("gender");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> lastLoginAt = createDateTime("lastLoginAt", java.time.LocalDateTime.class);

    public final StringPath nickname = createString("nickname");

    public final StringPath phone = createString("phone");

    public final StringPath profileImageUrl = createString("profileImageUrl");

    public final StringPath region = createString("region");

    public final EnumPath<com.jibangyoung.domain.auth.entity.UserRole> role = createEnum("role", com.jibangyoung.domain.auth.entity.UserRole.class);

    public final EnumPath<com.jibangyoung.domain.auth.entity.UserStatus> status = createEnum("status", com.jibangyoung.domain.auth.entity.UserStatus.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final com.jibangyoung.domain.auth.entity.QUser user;

    public final StringPath username = createString("username");

    public QUserProfile(String variable) {
        this(UserProfile.class, forVariable(variable), INITS);
    }

    public QUserProfile(Path<? extends UserProfile> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserProfile(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserProfile(PathMetadata metadata, PathInits inits) {
        this(UserProfile.class, metadata, inits);
    }

    public QUserProfile(Class<? extends UserProfile> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.jibangyoung.domain.auth.entity.QUser(forProperty("user")) : null;
    }

}

