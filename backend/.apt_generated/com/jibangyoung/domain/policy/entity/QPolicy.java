package com.jibangyoung.domain.policy.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPolicy is a Querydsl query type for Policy
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPolicy extends EntityPathBase<Policy> {

    private static final long serialVersionUID = -621473391L;

    public static final QPolicy policy = new QPolicy("policy");

    public final StringPath add_aply_qlfc_cnd_cn = createString("add_aply_qlfc_cnd_cn");

    public final StringPath aply_prd_se_cd = createString("aply_prd_se_cd");

    public final StringPath aply_url_addr = createString("aply_url_addr");

    public final StringPath aply_ymd = createString("aply_ymd");

    public final StringPath etc_mttr_cn = createString("etc_mttr_cn");

    public final StringPath job_cd = createString("job_cd");

    public final StringPath lclsf_nm = createString("lclsf_nm");

    public final StringPath mclsf_nm = createString("mclsf_nm");

    public final StringPath mrg_stts_cd = createString("mrg_stts_cd");

    public final NumberPath<Integer> NO = createNumber("NO", Integer.class);

    public final StringPath oper_inst_nm = createString("oper_inst_nm");

    public final StringPath plcy_aply_mthd_cn = createString("plcy_aply_mthd_cn");

    public final StringPath plcy_kywd_nm = createString("plcy_kywd_nm");

    public final StringPath plcy_nm = createString("plcy_nm");

    public final StringPath plcy_sprt_cn = createString("plcy_sprt_cn");

    public final StringPath ptcp_prp_trgt_cn = createString("ptcp_prp_trgt_cn");

    public final StringPath ref_url_addr1 = createString("ref_url_addr1");

    public final StringPath ref_url_addr2 = createString("ref_url_addr2");

    public final StringPath s_biz_cd = createString("s_biz_cd");

    public final StringPath sbmsn_dcmnt_cn = createString("sbmsn_dcmnt_cn");

    public final StringPath school_cd = createString("school_cd");

    public final NumberPath<Integer> sprt_scl_cnt = createNumber("sprt_scl_cnt", Integer.class);

    public final NumberPath<Integer> sprt_trgt_max_age = createNumber("sprt_trgt_max_age", Integer.class);

    public final NumberPath<Integer> sprt_trgt_min_age = createNumber("sprt_trgt_min_age", Integer.class);

    public final StringPath srng_mthd_cn = createString("srng_mthd_cn");

    public final StringPath zip_cd = createString("zip_cd");

    public QPolicy(String variable) {
        super(Policy.class, forVariable(variable));
    }

    public QPolicy(Path<? extends Policy> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPolicy(PathMetadata metadata) {
        super(Policy.class, metadata);
    }

}

