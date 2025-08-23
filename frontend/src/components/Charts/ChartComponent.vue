<template>
  <div class="chart-container" :style="{ height: height }">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
  BarElement,
  BarController,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
  BarElement,
  BarController,
  Filler
);

interface Props {
  type: "line" | "bar" | "pie" | "doughnut";
  data: any;
  options?: any;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: "100%",
  options: () => ({}),
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: ChartJS | null = null;

const createChart = async () => {
  if (!chartCanvas.value) return;

  await nextTick();

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  try {
    chartInstance = new ChartJS(ctx, {
      type: props.type,
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...props.options,
      },
    });
  } catch (error) {
    console.error("Erro ao criar gráfico:", error);
  }
};

const updateChart = () => {
  if (chartInstance && props.data) {
    chartInstance.data = props.data;
    chartInstance.update();
  }
};

watch(() => props.data, updateChart, { deep: true });
watch(() => props.type, createChart);
watch(() => props.options, createChart, { deep: true });

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
