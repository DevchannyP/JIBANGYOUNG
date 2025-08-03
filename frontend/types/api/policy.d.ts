// /types/api/policy.d.ts
export interface PolicyDetailDto {
  NO: number;
  plcy_nm: string;
  deadline: string;
  dDay: number;
  sidoName: string;
  ptcp_prp_trgt_cn: string;
  ref_url_addr1: string;
  ref_url_addr2: string;
  mclsf_nm: string;
  lclsf_nm: string;
  sprt_scl_cnt: number;
  plcy_aply_mthd_cn: string;
  add_aply_qlfc_cnd_cn: string;
  sprt_trgt_max_age: number;
  oper_inst_nm: string;
  aply_url_addr: string;
  plcy_sprt_cn: string;
  sprt_trgt_min_age: number;
  etc_mttr_cn: string;
  sbmsn_dcmnt_cn: string;
  srng_mthd_cn: string;
}
