import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  approved: number;
  ignored: number;
  invalid: number;
  pending: number;
  rejected: number;
  requested: number;
}

export function ReportDoughnutChart({
  approved,
  ignored,
  invalid,
  pending,
  rejected,
  requested,
}: Props) {
  const data = {
    labels: ["검토중", "승인", "승인요청중", "반려", "무시", "무효"],
    datasets: [
      {
        data: [pending, approved, requested, rejected, ignored, invalid],
        backgroundColor: [
          "#ffbdbd", // 검토중
          "#a7ffb7", // 승인
          "#ffe48c", // 승인요청중
          "#ffd6a5", // 반려
          "#a1c4fd", // 무시
          "#d1d1d1", // 무효
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: { boxWidth: 16, font: { size: 13 } },
      },
    },
    cutout: "65%",
    maintainAspectRatio: false,
    height: 140,
  };

  return (
    <div style={{ height: 140 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
