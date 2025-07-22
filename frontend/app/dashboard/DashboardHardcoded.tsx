// import MainHeroSection from "./components/MainHeroSection";
// import styles from "./components/styles/DashboardHardcoded.module.css";

// export default function DashboardHardcoded() {
//   return (
//     <main className={styles.bg}>
//       <MainHeroSection />
//       <div className={styles.row}>
//         {/* 왼쪽: 정책 카드 */}
//         <div className={styles.leftCol}>
//           <div
//             className={styles.cardBox}
//             tabIndex={0}
//             aria-label="내게 맞는 정책 보러가기 카드"
//           >
//             <div className={styles.cardTitleWrap}>
//               <span className={styles.cardTitle}>내게 맞는 정책 보러가기</span>
//               <span className={styles.heart}>💛</span>
//             </div>
//             <p className={styles.cardDesc}>
//               청년을 위한 다양한 지방 정책 정보,
//               <br />
//               내게 맞는 혜택을 쉽고 빠르게 찾아보세요.
//             </p>
//           </div>
//         </div>

//         {/* 중앙: 상단 메뉴/카드 그리드 */}
//         <div className={styles.centerCol}>
//           {/* 상단 메뉴 그리드 */}
//           <div className={styles.gridRow}>
//             <div className={styles.box}>
//               <div className={styles.boxTitleWrap}>
//                 <span className={styles.boxIcon} aria-label="지도">
//                   🗺️
//                 </span>
//                 <span className={styles.boxTitle}>
//                   전국 살기 좋은 지역 순위
//                 </span>
//               </div>
//               <div
//                 className={styles.tabs}
//                 role="tablist"
//                 aria-label="지역 순위 탭"
//               >
//                 <button
//                   className={styles.selectedTab}
//                   aria-selected="true"
//                   tabIndex={0}
//                 >
//                   1위 서울
//                 </button>
//                 <button className={styles.tab}>2위 경기</button>
//                 <button className={styles.tab}>대구</button>
//                 <button className={styles.tab}>3위 부산</button>
//               </div>
//             </div>
//             <div className={styles.box}>
//               <span className={styles.boxTitle}>인기 정책 후기</span>
//             </div>
//             <div className={styles.box}>
//               <div className={styles.boxTitleWrap}>
//                 <span className={styles.boxTitle}>오늘의 인기</span>
//                 <span className={styles.heart}>💛</span>
//               </div>
//               <ol className={styles.popularList} aria-label="오늘의 인기 목록">
//                 <li>서울 10대 행복지수 1위는...</li>
//                 <li>청년정책 2차 공모전</li>
//                 <li>5월 우수 정책 아이디어</li>
//                 <li>경기 신혼부부 지원</li>
//                 <li>광주 10대 청년활동</li>
//               </ol>
//             </div>
//           </div>
//           {/* 정책 카드 2개 */}
//           <div className={styles.cardGrid}>
//             <div
//               className={styles.policyCard}
//               tabIndex={0}
//               aria-label="[속보] 청년 정책자원 이벤트"
//             >
//               <div className={styles.policyImg} aria-hidden="true" />
//               <div>
//                 <div className={styles.policyTitle}>
//                   [속보] 청년 정책자원 이벤트
//                 </div>
//                 <div className={styles.policyDesc}>
//                   5분 만에 신청되는 Big 이벤트를 놓치지 마세요.
//                 </div>
//               </div>
//             </div>
//             <div
//               className={styles.policyCard}
//               tabIndex={0}
//               aria-label="[속보] 청년 정책자원 이벤트"
//             >
//               <div className={styles.policyImg} aria-hidden="true" />
//               <div>
//                 <div className={styles.policyTitle}>
//                   [속보] 청년 정책자원 이벤트
//                 </div>
//                 <div className={styles.policyDesc}>
//                   5분 만에 신청되는 Big 이벤트를 놓치지 마세요.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 오른쪽: 이미지 카드 + 주간 인기글 */}
//         <div className={styles.rightCol}>
//           <div
//             className={styles.rankingCard}
//             tabIndex={0}
//             aria-label="이미지 카드"
//           >
//             <div className={styles.policyImgLarge} aria-hidden="true" />
//             <div className={styles.rankingTitle}>
//               1. 서울 날씨 맞추면 100만원 지급...
//             </div>
//           </div>
//           <div className={styles.rankingBox}>
//             <div className={styles.rankingHeader}>
//               <span className={styles.rankingTopTitle}>주간 인기글 TOP10</span>
//               <span className={styles.rankingTopIcon} aria-label="엄지">
//                 👍
//               </span>
//             </div>
//             <ol className={styles.rankingList} aria-label="주간 인기글 TOP10">
//               <li>
//                 <b>2. 두번째 게시글 입니다...</b>{" "}
//                 <span className={styles.yellowDot} />
//               </li>
//               <li>
//                 <b>3. 5월 10대 행복정보 1위</b>{" "}
//                 <span className={styles.yellowDot} />
//               </li>
//               <li>두번째 게시글 입니다...</li>
//               <li>두번째 게시글 입니다...</li>
//               <li>두번째 게시글 입니다...</li>
//               <li>두번째 게시글 입니다...</li>
//               <li>두번째 게시글 입니다...</li>
//               <li>5월 10대 행복정보 1위</li>
//               <li>두번째 게시글 입니다...</li>
//               <li>10. 두번째 게시글 입니다...</li>
//             </ol>
//           </div>
//         </div>
//       </div>
//       <div className={styles.scrollMark} aria-hidden="true">
//         SCROLL <span>⌄</span>
//       </div>
//     </main>
//   );
// }
