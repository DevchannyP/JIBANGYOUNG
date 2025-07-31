package com.jibangyoung.domain.community.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QAttachments is a Querydsl query type for Attachments
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAttachments extends EntityPathBase<Attachments> {

    private static final long serialVersionUID = -1732029510L;

    public static final QAttachments attachments = new QAttachments("attachments");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath filePath = createString("filePath");

    public final NumberPath<Long> fileSize = createNumber("fileSize", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final StringPath mimeType = createString("mimeType");

    public final StringPath originalName = createString("originalName");

    public final NumberPath<Long> postsid = createNumber("postsid", Long.class);

    public final NumberPath<Integer> sortOrder = createNumber("sortOrder", Integer.class);

    public final StringPath storedName = createString("storedName");

    public QAttachments(String variable) {
        super(Attachments.class, forVariable(variable));
    }

    public QAttachments(Path<? extends Attachments> path) {
        super(path.getType(), path.getMetadata());
    }

    public QAttachments(PathMetadata metadata) {
        super(Attachments.class, metadata);
    }

}

