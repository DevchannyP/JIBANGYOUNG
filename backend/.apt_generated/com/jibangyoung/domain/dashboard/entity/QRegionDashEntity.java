package com.jibangyoung.domain.dashboard.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRegionDashEntity is a Querydsl query type for RegionDashEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRegionDashEntity extends EntityPathBase<RegionDashEntity> {

    private static final long serialVersionUID = 1738425354L;

    public static final QRegionDashEntity regionDashEntity = new QRegionDashEntity("regionDashEntity");

    public final StringPath guGun1 = createString("guGun1");

    public final StringPath guGun2 = createString("guGun2");

    public final NumberPath<Integer> regionCode = createNumber("regionCode", Integer.class);

    public final StringPath sido = createString("sido");

    public QRegionDashEntity(String variable) {
        super(RegionDashEntity.class, forVariable(variable));
    }

    public QRegionDashEntity(Path<? extends RegionDashEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRegionDashEntity(PathMetadata metadata) {
        super(RegionDashEntity.class, metadata);
    }

}

