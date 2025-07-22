// // app/dashboard/ClientDashboardShell.tsx
// "use client";
// import { useInView } from "framer-motion";
// import dynamic from "next/dynamic";
// import { Suspense, useEffect, useRef, useState } from "react";
// import MainHeroSection from "./components/MainHeroSection";
// import SkeletonCardGrid from "./components/SkeletonCardGrid";
// import styles from "./components/styles/ClientDashboardShell.module.css";

// // CSR 섹션 dynamic 분리 (코드 스플리팅/UX up)
// const CommunitySection = dynamic(
//   () => import("./components/CommunitySection"),
//   {
//     ssr: false,
//     loading: () => <SkeletonCardGrid count={3} />,
//   }
// );
// const RegionRankingSection = dynamic(
//   () => import("./components/RegionRankingSection"),
//   {
//     ssr: false,
//     loading: () => <SkeletonCardGrid count={1} />,
//   }
// );
// const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
//   ssr: false,
//   loading: () => <div style={{ height: 120 }} />,
// });

// export default function ClientDashboardShell() {
//   const communityRef = useRef(null);
//   const regionRef = useRef(null);
//   const sliderRef = useRef(null);
//   const [showCommunity, setShowCommunity] = useState(false);
//   const [showRegion, setShowRegion] = useState(false);
//   const [showSlider, setShowSlider] = useState(false);

//   // Viewport in/out observer (섹션 진입 시 CSR로딩)
//   const communityInView = useInView(communityRef, {
//     once: true,
//     margin: "-120px",
//   });
//   const regionInView = useInView(regionRef, { once: true, margin: "-120px" });
//   const sliderInView = useInView(sliderRef, { once: true, margin: "-200px" });

//   useEffect(() => {
//     if (communityInView) setShowCommunity(true);
//   }, [communityInView]);
//   useEffect(() => {
//     if (regionInView) setShowRegion(true);
//   }, [regionInView]);
//   useEffect(() => {
//     if (sliderInView) setShowSlider(true);
//   }, [sliderInView]);

//   return (
//     <main className={styles.main}>
//       <MainHeroSection />
//       <div className={styles.gridSection}>
//         <section className={styles.leftCol}>
//           {/* 내게 맞는 정책 보러가기 카드 */}
//           <div className={styles.leftCardBox}>
//             <h4 className={styles.leftCardTitle}>
//               내게 맞는 정책 보러가기 <span>💛</span>
//             </h4>
//             <p className={styles.leftCardDesc}>
//               청년을 위한 다양한 지방 정책 정보,
//               <br />
//               내게 맞는 혜택을 쉽고 빠르게 찾아보세요.
//             </p>
//           </div>
//         </section>
//         <section className={styles.centerCol}>
//           {/* 인기 정책 후기 + 오늘의 인기 */}
//           <div ref={communityRef}>
//             {showCommunity ? (
//               <Suspense fallback={<SkeletonCardGrid count={2} />}>
//                 <CommunitySection />
//               </Suspense>
//             ) : (
//               <SkeletonCardGrid count={2} />
//             )}
//           </div>
//         </section>
//         <section className={styles.rightCol}>
//           {/* 주간 인기글 TOP10 */}
//           <div ref={regionRef}>
//             {showRegion ? (
//               <Suspense fallback={<SkeletonCardGrid count={1} />}>
//                 <RegionRankingSection />
//               </Suspense>
//             ) : (
//               <SkeletonCardGrid count={1} />
//             )}
//           </div>
//         </section>
//       </div>

//       {/* 커뮤니케이션 Hot */}
//       <div className={styles.hotSection}>
//         <h3>
//           <span className={styles.hotBadge}>커뮤니케이션</span>
//           <span className={styles.hotTitle}>
//             우리 동네 우리들의{" "}
//             <span className={styles.hotAccent}>가장 HOT 이야기</span>
//           </span>
//         </h3>
//         {/* 커뮤니티 테이블/리스트 섹션 (동일 패턴 반복) */}
//         <div className={styles.hotGrid}>
//           {[0, 1, 2].map((i) => (
//             <div key={i} className={styles.hotTableBox}>
//               <div className={styles.hotTableHeader}>
//                 <span className={styles.hotTableBadge}>월간 인기</span>
//               </div>
//               <table className={styles.hotTable}>
//                 <thead>
//                   <tr>
//                     <th>NO</th>
//                     <th>제목</th>
//                     <th>글쓴이</th>
//                     <th>조회</th>
//                     <th>추천</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[1, 2, 3, 4, 5].map((r) => (
//                     <tr key={r}>
//                       <td>0{r}</td>
//                       <td>춘천 청년정책지역 뭐해요 임실 강원...</td>
//                       <td>오빠네</td>
//                       <td>50</td>
//                       <td>56</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 하단 지역 Tab 슬라이더 */}
//       <section ref={sliderRef} className={styles.sliderSection}>
//         {showSlider ? <RegionTabSlider /> : <div style={{ height: 120 }} />}
//       </section>
//     </main>
//   );
// }
