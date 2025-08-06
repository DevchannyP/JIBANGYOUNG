import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  notice: number;
  post: number;
  comment: number;
}

export function PostCommentBarChart({ notice, post, comment }: Props) {
  const data = {
    labels: ["공지", "게시글", "댓글"],
    datasets: [
      {
        label: "작성 수",
        data: [notice, post, comment],
        backgroundColor: ["#a5c8ff", "#b6d6ff", "#d1e3ff"],
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { display: false },
      },
      y: { grid: { display: false } },
    },
    maintainAspectRatio: false,
    height: 80,
  };

  return (
    <div style={{ height: 100, padding: "8px 0" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
