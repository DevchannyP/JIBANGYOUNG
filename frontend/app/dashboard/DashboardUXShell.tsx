// // app/dashboard/DashboardUXShell.tsx
// "use client";
// import { motion, useInView } from "framer-motion";
// import dynamic from "next/dynamic";
// import { useEffect, useRef, useState } from "react";
// import MainHeroSection from "./components/MainHeroSection";
// import SkeletonCardGrid from "./components/SkeletonCardGrid";
// // Locomotive Scroll
// import LocomotiveScroll from "locomotive-scroll";
// import "locomotive-scroll/dist/locomotive-scroll.css";
// import styles from "./styles/DashboardUXShell.module.css";

// const CommunitySection = dynamic(
//   () => import("./components/CommunitySection"),
//   { ssr: false, loading: () => <SkeletonCardGrid count={2} /> }
// );
// const RegionRankingSection = dynamic(
//   () => import("./components/RegionRankingSection"),
//   { ssr: false, loading: () => <SkeletonCardGrid count={1} /> }
// );
// const RegionTabSlider = dynamic(() => import("./components/RegionTabSlider"), {
//   ssr: false,
//   loading: () => <div style={{ height: 120 }} />,
// });
// const GuideModal = dynamic(() => import("./components/GuideModal"), {
//   ssr: false,
// });

// export default function DashboardUXShell() {
//   // Locomotive Scroll Setup
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       const scroll = new LocomotiveScroll({
//         el: scrollRef.current,
//         smooth: true,
//         smartphone: { smooth: true },
//         tablet: { smooth: true },
//       });
//       return () => scroll.destroy();
//     }
//   }, []);

//   // Intersection Observer 로딩
//   const refHot = useRef(null),
//     refSlider = useRef(null);
//   const [showHot, setShowHot] = useState(false),
//     [showSlider, setShowSlider] = useState(false);
//   const inViewHot = useInView(refHot, { once: true, margin: "-120px" });
//   const inViewSlider = useInView(refSlider, { once: true, margin: "-120px" });
//   useEffect(() => {
//     if (inViewHot) setShowHot(true);
//   }, [inViewHot]);
//   useEffect(() => {
//     if (inViewSlider) setShowSlider(true);
//   }, [inViewSlider]);

//   // Guide Modal 사용
//   const [showGuide, setShowGuide] = useState(false);
//   useEffect(() => {
//     // 진입 시 1회 온보딩 가이드 자동 오픈
//     setTimeout(() => setShowGuide(true), 900);
//   }, []);

//   return (
//     <>
//       <main
//         ref={scrollRef}
//         data-scroll-container
//         className={styles.fullpageRoot}
//       >
//         {/* SECTION 1 */}
//         <motion.section
//           initial={{ opacity: 0, y: 44 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
//           className={styles.section}
//           aria-label="메인 대시보드"
//           data-scroll-section
//         >
//           <MainHeroSection />
//           <div className={styles.gridSection}>
//             <motion.div className={styles.leftCol} whileHover={{ scale: 1.04 }}>
//               <div className={styles.leftCardBox}>
//                 <h4 className={styles.leftCardTitle}>
//                   내게 맞는 정책 보러가기 <span>💛</span>
//                 </h4>
//                 <p className={styles.leftCardDesc}>
//                   청년을 위한 다양한 지방 정책 정보,
//                   <br />
//                   내게 맞는 혜택을 쉽고 빠르게 찾아보세요.
//                 </p>
//               </div>
//             </motion.div>
//             <motion.div
//               className={styles.centerCol}
//               whileHover={{ scale: 1.02 }}
//             >
//               <CommunitySection />
//             </motion.div>
//             <motion.div
//               className={styles.rightCol}
//               whileHover={{ scale: 1.02 }}
//             >
//               <RegionRankingSection />
//             </motion.div>
//           </div>
//           <div className={styles.scrollMark} aria-hidden="true">
//             SCROLL <span>⌄</span>
//           </div>
//         </motion.section>

//         {/* SECTION 2 - 커뮤니티 HOT */}
//         <section
//           ref={refHot}
//           className={styles.section}
//           aria-label="커뮤니티 HOT"
//           data-scroll-section
//         >
//           {showHot && (
//             <motion.div
//               initial={{ opacity: 0, y: 60 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, type: "spring", bounce: 0.18 }}
//               className={styles.hotSection}
//             >
//               <h3>
//                 <span className={styles.hotBadge}>커뮤니케이션</span>
//                 <span className={styles.hotTitle}>
//                   우리 동네 우리들의{" "}
//                   <span className={styles.hotAccent}>가장 HOT 이야기</span>
//                 </span>
//               </h3>
//               <div className={styles.hotGrid}>
//                 {[0, 1, 2].map((i) => (
//                   <div key={i} className={styles.hotTableBox}>
//                     <div className={styles.hotTableHeader}>
//                       <span className={styles.hotTableBadge}>월간 인기</span>
//                     </div>
//                     <table className={styles.hotTable}>
//                       <thead>
//                         <tr>
//                           <th>NO</th>
//                           <th>제목</th>
//                           <th>글쓴이</th>
//                           <th>조회</th>
//                           <th>추천</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {[1, 2, 3, 4, 5].map((r) => (
//                           <tr key={r}>
//                             <td>0{r}</td>
//                             <td>춘천 청년정책지역 뭐해요 임실 강원...</td>
//                             <td>오빠네</td>
//                             <td>50</td>
//                             <td>56</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </section>

//         {/* SECTION 3 - 지역 Tab 슬라이더 */}
//         <section
//           ref={refSlider}
//           className={styles.section}
//           aria-label="지역 랭킹 슬라이더"
//           data-scroll-section
//         >
//           {showSlider && (
//             <motion.div
//               initial={{ opacity: 0, y: 44 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, type: "spring", bounce: 0.22 }}
//               className={styles.sliderSection}
//             >
//               <RegionTabSlider />
//             </motion.div>
//           )}
//         </section>
//       </main>
//       <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
//     </>
//   );
// }
