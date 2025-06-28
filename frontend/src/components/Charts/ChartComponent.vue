<template>
  <div class="relative">
    <canvas :ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface Props {
  type: "line" | "bar" | "doughnut" | "pie";
  data: any;
  options?: any;
}

const props = defineProps<Props>();

const chartRef = ref<HTMLCanvasElement>();
let chartInstance: Chart | null = null;

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e5e7eb",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#e5e7eb",
      },
      grid: {
        color: "#374151",
      },
    },
    y: {
      ticks: {
        color: "#e5e7eb",
      },
      grid: {
        color: "#374151",
      },
    },
  },
};

const createChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      ...defaultOptions,
      ...props.options,
    },
  });
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = props.data;
    chartInstance.update();
  }
};

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

watch(() => props.data, updateChart, { deep: true });
</script>
