package com.jibangyoung.domain.auth.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPasswordResetToken is a Querydsl query type for PasswordResetToken
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPasswordResetToken extends EntityPathBase<PasswordResetToken> {

    private static final long serialVersionUID = -588750406L;

    public static final QPasswordResetToken passwordResetToken = new QPasswordResetToken("passwordResetToken");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final DateTimePath<java.time.LocalDateTime> expiresAt = createDateTime("expiresAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath token = createString("token");

    public final BooleanPath used = createBoolean("used");

    public QPasswordResetToken(String variable) {
        super(PasswordResetToken.class, forVariable(variable));
    }

    public QPasswordResetToken(Path<? extends PasswordResetToken> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPasswordResetToken(PathMetadata metadata) {
        super(PasswordResetToken.class, metadata);
    }

}

