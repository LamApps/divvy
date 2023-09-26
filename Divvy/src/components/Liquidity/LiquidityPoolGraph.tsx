import { useState, useEffect, useRef } from 'react';
// import { Line, LineConfig } from '@ant-design/charts';
import { Pool, PoolGraph } from '../../constants';
import { DATE_STRING_TO_NUMBER } from '../../constants/DashboardColumns';
import { BarElement, CategoryScale, Chart as ChartJS, ChartArea, ChartData, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, '#7c01ff');
  gradient.addColorStop(1, '#00d77d');
  return gradient;
}

const LiquidityPoolGraph = (props: { data : Array<Pool> | undefined, poolPerformance: number }) => {
  const [chartRawData, setChartRawData] = useState<PoolGraph[]>([])
  const [chartData, setChartData] = useState<ChartData<'bar'> | ChartData<'line'>>({
    datasets: [],
  });
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if(props.data) {
      let tmp : PoolGraph[] = [];
      props.data.map(item => {
        let d = (new Date(JSON.parse(item?.day))).toString();
        let tmpArr = [];
        tmpArr = d.split(" ")
        tmp.push({ "date": tmpArr[2]+"/"+(DATE_STRING_TO_NUMBER as any)[tmpArr[1]]+"/"+tmpArr[3], "performance": props.poolPerformance == 1 ? item?.earning : props.poolPerformance == 0 ? item?.balance : item?.volume })
      })
      setChartRawData([ ...tmp ]);
    } 
  }, [props.data, props.poolPerformance])

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    const chartDataBuf = {
      labels: chartRawData.map(data => data.date),
      datasets: [{
        label: '',
        data: chartRawData.map(data => data.performance),
        borderColor: createGradient(chart.ctx, chart.chartArea),
        backgroundColor: createGradient(chart.ctx, chart.chartArea),
      }],
    };

    setChartData(chartDataBuf);
  }, [chartRawData]);

  return (
    <>
    { props.poolPerformance == 1 && window.location.pathname != ('/dashboard') ?
      <Bar ref={chartRef} data={chartData as any} options={{
        plugins: {legend: {display: false}, tooltip: {enabled: true, mode: 'nearest'}},
        scales: {
          y: {grid: {color: 'gray'}, ticks: {color: 'gray'}},
          x: {grid: {color: 'gray'}, ticks: {color: 'gray', autoSkip: true, maxTicksLimit: 10}}
        },
      }} />
      : 
      <Line ref={chartRef} data={chartData as any} options={{
        plugins: {legend: {display: false}, tooltip: {enabled: true, mode: 'nearest'}},
        scales: {
          y: {grid: {color: 'gray'}, ticks: {color: 'gray'}},
          x: {grid: {color: 'gray'}, ticks: {color: 'gray', autoSkip: true, maxTicksLimit: 10}}
        },
      }} />
    }
    </>
  );
};
export default LiquidityPoolGraph;
