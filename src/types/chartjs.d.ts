declare module 'chart.js' {
  const Chart: any;
  export { Chart };
  export default Chart;

  // Expose common chart.js pieces as any to satisfy TypeScript in this project.
  export const CategoryScale: any;
  export const LinearScale: any;
  export const BarElement: any;
  export const LineElement: any;
  export const PointElement: any;
  export const BarController: any;
  export const LineController: any;
  export const Tooltip: any;
  export const Legend: any;
  export const Title: any;
  export const registerables: any;
}

declare module 'chart.js/auto' {
  import Chart from 'chart.js';
  export default Chart;
}
