package com.jibangyoung.domain.policy.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPolicyView is a Querydsl query type for PolicyView
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPolicyView extends EntityPathBase<PolicyView> {

    private static final long serialVersionUID = 1344835542L;

    public static final QPolicyView policyView = new QPolicyView("policyView");

    public final StringPath addAplyQlfcCndCn = createString("addAplyQlfcCndCn");

    public final StringPath aplyUrlAddr = createString("aplyUrlAddr");

    public final StringPath aplyYmd = createString("aplyYmd");

    public final StringPath bizPrdEtcCn = createString("bizPrdEtcCn");

    public final StringPath etcMttrCn = createString("etcMttrCn");

    public final StringPath lclsfNm = createString("lclsfNm");

    public final StringPath mclsfNm = createString("mclsfNm");

    public final NumberPath<Integer> No = createNumber("No", Integer.class);

    public final StringPath operInstNm = createString("operInstNm");

    public final StringPath plcyAplyMthdCn = createString("plcyAplyMthdCn");

    public final StringPath plcyExplnCn = createString("plcyExplnCn");

    public final StringPath plcyKywdNm = createString("plcyKywdNm");

    public final StringPath plcyNm = createString("plcyNm");

    public final StringPath plcySprtCn = createString("plcySprtCn");

    public final StringPath ptcpPrpTrgtCn = createString("ptcpPrpTrgtCn");

    public final StringPath pvsnInstGroupCd = createString("pvsnInstGroupCd");

    public final StringPath refUrlAddr1 = createString("refUrlAddr1");

    public final StringPath refUrlAddr2 = createString("refUrlAddr2");

    public final StringPath sbmsnDcmntCn = createString("sbmsnDcmntCn");

    public final NumberPath<Integer> sprtSclCnt = createNumber("sprtSclCnt", Integer.class);

    public final NumberPath<Integer> sprtTrgtMaxAge = createNumber("sprtTrgtMaxAge", Integer.class);

    public final NumberPath<Integer> sprtTrgtMinAge = createNumber("sprtTrgtMinAge", Integer.class);

    public final StringPath sprvsnInstNm = createString("sprvsnInstNm");

    public final StringPath srngMthdCn = createString("srngMthdCn");

    public final StringPath zipCd = createString("zipCd");

    public QPolicyView(String variable) {
        super(PolicyView.class, forVariable(variable));
    }

    public QPolicyView(Path<? extends PolicyView> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPolicyView(PathMetadata metadata) {
        super(PolicyView.class, metadata);
    }

}

