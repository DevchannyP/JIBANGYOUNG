// "use client";
// import dynamic from "next/dynamic";
// import { Suspense, useRef, useEffect, useState } from "react";
// import styles from "./components/styles/ClientDashboardFullPage.module.css";
// import MainHeroSection from "./components/MainHeroSection";
// import SkeletonCardGrid from "./components/SkeletonCardGrid";
// import { useInView } from "framer-motion";

// const CommunitySection = dynamic(
//   () => import("./components/CommunitySection"),
//   {
//     ssr: false,
//     loading: () => <SkeletonCardGrid count={3} />,
//   }
// );
// const RegionRankingSection = dynamic(
//   () => import("./components/RegionRankingSection"),
//   { ssr: false, loading: () => <SkeletonCardGrid count={1} /> }
// );
// const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
//   ssr: false,
//   loading: () => <div style={{ height: 120 }} />,
// });

// export default function ClientDashboardFullPage() {
//   const ref1 = useRef(null),
//     ref2 = useRef(null),
//     ref3 = useRef(null);
//   const [show1, setShow1] = useState(true);
//   const [show2, setShow2] = useState(false);
//   const [show3, setShow3] = useState(false);

//   const inView2 = useInView(ref2, { once: true, margin: "-80px" });
//   const inView3 = useInView(ref3, { once: true, margin: "-80px" });

//   useEffect(() => {
//     if (inView2) setShow2(true);
//   }, [inView2]);
//   useEffect(() => {
//     if (inView3) setShow3(true);
//   }, [inView3]);

//   return (
//     <main className={styles.fullpageRoot}>
//       {/* SECTION 1 */}
//       <section
//         ref={ref1}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="메인 대시보드"
//       >
//         <MainHeroSection />
//         <div className={styles.gridSection}>
//           <div className={styles.leftCol}>
//             <div className={styles.leftCardBox}>
//               <h4 className={styles.leftCardTitle}>
//                 내게 맞는 정책 보러가기 <span>💛</span>
//               </h4>
//               <p className={styles.leftCardDesc}>
//                 청년을 위한 다양한 지방 정책 정보,
//                 <br />
//                 내게 맞는 혜택을 쉽고 빠르게 찾아보세요.
//               </p>
//             </div>
//           </div>
//           <div className={styles.centerCol}>
//             <Suspense fallback={<SkeletonCardGrid count={2} />}>
//               <CommunitySection />
//             </Suspense>
//           </div>
//           <div className={styles.rightCol}>
//             <Suspense fallback={<SkeletonCardGrid count={1} />}>
//               <RegionRankingSection />
//             </Suspense>
//           </div>
//         </div>
//       </section>
//       {/* SECTION 2 */}
//       <section
//         ref={ref2}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="커뮤니케이션 HOT"
//       >
//         {show2 && (
//           <div className={styles.hotSection}>
//             <h3>
//               <span className={styles.hotBadge}>커뮤니케이션</span>
//               <span className={styles.hotTitle}>
//                 우리 동네 우리들의{" "}
//                 <span className={styles.hotAccent}>가장 HOT 이야기</span>
//               </span>
//             </h3>
//             <div className={styles.hotGrid}>
//               {[0, 1, 2].map((i) => (
//                 <div key={i} className={styles.hotTableBox}>
//                   <div className={styles.hotTableHeader}>
//                     <span className={styles.hotTableBadge}>월간 인기</span>
//                   </div>
//                   <table className={styles.hotTable}>
//                     <thead>
//                       <tr>
//                         <th>NO</th>
//                         <th>제목</th>
//                         <th>글쓴이</th>
//                         <th>조회</th>
//                         <th>추천</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {[1, 2, 3, 4, 5].map((r) => (
//                         <tr key={r}>
//                           <td>0{r}</td>
//                           <td>춘천 청년정책지역 뭐해요 임실 강원...</td>
//                           <td>오빠네</td>
//                           <td>50</td>
//                           <td>56</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </section>
//       {/* SECTION 3 */}
//       <section
//         ref={ref3}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="지역 랭킹 슬라이더"
//       >
//         {show3 && (
//           <div className={styles.sliderSection}>
//             <RegionTabSlider />
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }
