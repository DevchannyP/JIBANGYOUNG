// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { getMyAlerts } from "@/libs/api/mypage.api";
// import type { AlertInfoDto } from "@/types/api/mypage.types";
// import styles from "../MyPageLayout.module.css";

// // ...컴포넌트 코드 아래 생략...

// // 날짜 포맷 (YY.MM.DD)
// function formatDate(dateStr: string) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("ko-KR", {
//     year: "2-digit",
//     month: "2-digit",
//     day: "2-digit",
//   });
// }

// // Skeleton
// function AlertListSkeleton() {
//   return (
//     <ul className={styles.mypageList} aria-busy="true">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <li key={i} className={styles.mypageListItem + " animate-pulse"}>
//           <span
//             className={styles.mypageListLabel}
//             style={{ width: 60, background: "#eee", borderRadius: 6 }}
//           >
//             &nbsp;
//           </span>
//           <span
//             className={styles.mypageListTitle}
//             style={{
//               width: 160,
//               background: "#eee",
//               borderRadius: 6,
//               marginLeft: 8,
//             }}
//           >
//             &nbsp;
//           </span>
//           <span
//             className={styles.mypageListTime}
//             style={{ width: 80, background: "#eee", borderRadius: 6 }}
//           >
//             &nbsp;
//           </span>
//         </li>
//       ))}
//     </ul>
//   );
// }

// interface MyAlertListProps {
//   userId: number;
// }

// export default function MyAlertList({ userId }: MyAlertListProps) {
//   // page/size 고정형 (확장 필요시 외부로)
//   const page = 1,
//     size = 10;
//   const { data, isLoading, isError, isFetching, refetch } = useQuery({
//     queryKey: ["user", userId, "alerts", { page, size }],
//     // 반드시 userId 포함해서 전달!
//     queryFn: () => getMyAlerts({ userId, page, size }),
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 3,
//     gcTime: 1000 * 60 * 10,
//   });

//   if (isLoading || isFetching) return <AlertListSkeleton />;
//   if (isError)
//     return (
//       <div className={styles.mypageLoading}>
//         알림을 불러오지 못했습니다.{" "}
//         <button onClick={() => refetch()}>다시 시도</button>
//       </div>
//     );
//   if (!data?.alerts?.length) return <div>알림이 없습니다.</div>;

//   return (
//     <section aria-labelledby="alert-title">
//       <div id="alert-title" className={styles.mypageSectionTitle}>
//         관심지역 알림
//         <hr />
//       </div>
//       <ul className={styles.mypageList}>
//         {data.alerts.map((a: AlertInfoDto) => (
//           <li
//             key={a.id}
//             className={
//               styles.mypageListItem +
//               (a.isRead ? ` ${styles.alertRead}` : ` ${styles.alertUnread}`)
//             }
//             tabIndex={0}
//             aria-label={`${a.region} ${a.message} ${formatDate(a.createdAt)}${a.isRead ? " (읽음)" : " (안읽음)"}`}
//           >
//             <span className={styles.mypageListLabel}>[{a.region}]</span>
//             <span className={styles.mypageListTitle}>{a.message}</span>
//             <span className={styles.mypageListTime}>
//               {formatDate(a.createdAt)}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }
