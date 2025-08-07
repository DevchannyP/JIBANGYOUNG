import styles from "./privacy.module.css";

export default function privacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>개인정보처리방침</h1>

      <h2 className={styles.sectionTitle}>1. 수집하는 개인정보의 항목</h2>
      <div className={styles.content}>
        <p>
          회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를
          수집하고 있습니다.
        </p>
        <ul>
          <li>필수항목: 이메일, 비밀번호, 닉네임, 거주 지역</li>
          <li>선택항목: 관심 분야, 학력, 경력</li>
        </ul>
      </div>

      <h2 className={styles.sectionTitle}>2. 개인정보의 수집 및 이용목적</h2>
      <div className={styles.content}>
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
        <ul>
          <li>회원제 서비스 이용에 따른 본인확인</li>
          <li>맞춤형 정책 추천 및 멘토링 서비스 제공</li>
          <li>고지사항 전달, 불만처리 등 원활한 의사소통 경로의 확보</li>
        </ul>
      </div>

      <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용기간</h2>
      <div className={styles.content}>
        <p>
          원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체
          없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우
          회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를
          보관합니다.
        </p>
      </div>
    </div>
  );
}
