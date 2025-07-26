import CommunitySectionClient from "./CommunitySection/CommunitySection";
import styles from "./CommunitySection/CommunitySection.module.css";

export default function CommunitySectionServer() {
  // SSR SEO: 구조·배경까지 렌더
  return (
    <section className={styles.sectionRoot}>
      <div className={styles.bgYellow} aria-hidden="true" />
      <CommunitySectionClient />
    </section>
  );
}
