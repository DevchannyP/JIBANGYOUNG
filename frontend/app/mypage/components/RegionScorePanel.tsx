// components/RegionScorePanel.tsx
import { UserProfileDto } from "../../../libs/api/mypage.api";
import styles from "./MyPageLayout.module.css";

export default function RegionScorePanel({ user }: { user: UserProfileDto }) {
  const regionList = user.region ? [user.region] : [];

  return (
    <section>
      <div className={styles.mypageSectionTitle}>
        지역별 점수
        <hr />
      </div>
      <div className={styles.mypageRegionScoreRow}>
        <label htmlFor="regionSelect" style={{ fontWeight: 500 }}>
          내 지역선택
        </label>
        <select
          id="regionSelect"
          className={styles.mypageSelect}
          defaultValue={regionList[0] ?? ""}
          disabled={regionList.length < 1}
        >
          {regionList.length < 1 ? (
            <option value="">관심지역 없음</option>
          ) : (
            regionList.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))
          )}
        </select>
      </div>
      <ul className={styles.mypageScoreList}>
        <li>
          <span>게시글 작성 수</span>
          <span className="scoreValue"> 1건당 10점</span>
        </li>
        <li>
          <span>댓글 작성 수</span>
          <span className="scoreValue"> 1건당 5점</span>
        </li>
        <li>
          <span>멘토링 활동 시</span>
          <span className="scoreValue"> 1회당 20점</span>
        </li>
      </ul>
      <div className={styles.mypageProgressBox}>
        <strong>조력자 승급 진행률</strong>
        <div style={{ marginTop: 8, fontSize: 15 }}>
          300점 중{" "}
          <span style={{ color: "#306bff", fontWeight: 600 }}>235점</span> /
          멘토 인증: <span style={{ color: "#fc3535" }}>43일</span>
        </div>
      </div>
    </section>
  );
}
