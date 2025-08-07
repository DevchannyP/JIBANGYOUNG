import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        <h1 className={styles.title}>JIBANGYOUNG</h1>
        <p className={styles.subtitle}>
          지방 청년들의 가능성이 실현되는 곳
        </p>
        <p className={styles.mainText}>
          <strong>JIBANGYOUNG</strong>은 지역의 경계를 넘어 청년들이 꿈을 펼칠 수 있도록 돕는 플랫폼입니다.
          <br />
          다양한 정책 정보, 지역 커뮤니티, 그리고 현직자 멘토링을 통해
          <br />
          여러분의 성장을 지원하고 새로운 기회를 연결합니다.
        </p>
      </div>
    </div>
  );
}
