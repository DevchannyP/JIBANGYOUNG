package com.jibangyoung.domain.policy.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRegion is a Querydsl query type for Region
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRegion extends EntityPathBase<Region> {

    private static final long serialVersionUID = -573598893L;

    public static final QRegion region = new QRegion("region");

    public final StringPath guGun1 = createString("guGun1");

    public final StringPath guGun2 = createString("guGun2");

    public final NumberPath<Integer> regionCode = createNumber("regionCode", Integer.class);

    public final StringPath sido = createString("sido");

    public QRegion(String variable) {
        super(Region.class, forVariable(variable));
    }

    public QRegion(Path<? extends Region> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRegion(PathMetadata metadata) {
        super(Region.class, metadata);
    }

}

