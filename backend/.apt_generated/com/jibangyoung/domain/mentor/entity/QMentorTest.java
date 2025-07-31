package com.jibangyoung.domain.mentor.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QMentorTest is a Querydsl query type for MentorTest
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMentorTest extends EntityPathBase<MentorTest> {

    private static final long serialVersionUID = -873197151L;

    public static final QMentorTest mentorTest = new QMentorTest("mentorTest");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> currentScore = createNumber("currentScore", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isActive = createBoolean("isActive");

    public final BooleanPath isCertifiedByPublic = createBoolean("isCertifiedByPublic");

    public final DateTimePath<java.time.LocalDateTime> levelAcquiredAt = createDateTime("levelAcquiredAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> regionId = createNumber("regionId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final NumberPath<Integer> warningCount = createNumber("warningCount", Integer.class);

    public QMentorTest(String variable) {
        super(MentorTest.class, forVariable(variable));
    }

    public QMentorTest(Path<? extends MentorTest> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMentorTest(PathMetadata metadata) {
        super(MentorTest.class, metadata);
    }

}

