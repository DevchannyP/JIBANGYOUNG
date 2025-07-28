package com.jibangyoung.domain.recommendation.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QInfraData is a Querydsl query type for InfraData
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QInfraData extends EntityPathBase<InfraData> {

    private static final long serialVersionUID = 1032578356L;

    public static final QInfraData infraData = new QInfraData("infraData");

    public final StringPath accessibilityGroup = createString("accessibilityGroup");

    public final StringPath housingPriceGroup = createString("housingPriceGroup");

    public final NumberPath<Double> housingPriceScore = createNumber("housingPriceScore", Double.class);

    public final NumberPath<Integer> medicalAccessibilityIndex = createNumber("medicalAccessibilityIndex", Integer.class);

    public final StringPath medicalInfraGrade = createString("medicalInfraGrade");

    public final NumberPath<Integer> medicalInfraScore = createNumber("medicalInfraScore", Integer.class);

    public final StringPath regionCode = createString("regionCode");

    public final NumberPath<Double> totalInfraScore = createNumber("totalInfraScore", Double.class);

    public final StringPath transportInfraGrade = createString("transportInfraGrade");

    public final NumberPath<Double> transportInfraScore = createNumber("transportInfraScore", Double.class);

    public QInfraData(String variable) {
        super(InfraData.class, forVariable(variable));
    }

    public QInfraData(Path<? extends InfraData> path) {
        super(path.getType(), path.getMetadata());
    }

    public QInfraData(PathMetadata metadata) {
        super(InfraData.class, metadata);
    }

}

