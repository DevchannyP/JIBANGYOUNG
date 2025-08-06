import styles from "./terms.module.css";

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이용약관</h1>

      <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
      <div className={styles.content}>
        <p>
          이 약관은 JIBANGYOUNG (이하 &quot;서비스&quot;)의 이용과 관련하여
          서비스와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
          목적으로 합니다.
        </p>
      </div>

      <h2 className={styles.sectionTitle}>제2조 (회원의 의무)</h2>
      <div className={styles.content}>
        <p>
          회원은 서비스의 이용과 관련하여 다음 각 호의 행위를 하여서는 안
          됩니다.
          <br />
          1. 타인의 정보 도용
          <br />
          2. 서비스에서 얻은 정보를 상업적으로 이용하는 행위
          <br />
          3. 허위 사실을 유포하거나 명예를 훼손하는 행위
        </p>
      </div>

      <h2 className={styles.sectionTitle}>제3조 (서비스의 중단)</h2>
      <div className={styles.content}>
        <p>
          서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절
          또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할
          수 있습니다.
        </p>
      </div>
    </div>
  );
}
