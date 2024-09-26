import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ExerciseHistory({
  history,
  exerciseName,
  isOpen,
  onClose,
}: ExerciseHistoryProps) {
  const data = {
    labels: history.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "Average Weight (kg)",
        data: history.map((entry) => entry.averageWeight),
        fill: false,
        backgroundColor: "rgb(255,255,255)",
        borderColor: "rgba(255,255,255, 0.7)",
        pointRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Average Reps",
        data: history.map((entry) => entry.averageReps),
        fill: false,
        backgroundColor: "rgb(255,0,0)",
        borderColor: "rgba(255,0,0, 0.7)",
        pointRadius: 4,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Weight and Reps",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Weight (kg)",
          font: {
            size: 14,
          },
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Reps",
          font: {
            size: 14,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="grid-cols-1">
        <DialogHeader>
          <DialogTitle>Progress Chart</DialogTitle>
          <DialogDescription>{exerciseName}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center">
          <Line options={options} data={data} height={10} width={10} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
