import { parseJson } from '@cross/cookies';
import { IChartingLibraryWidget } from '../../public/static/charting_library/charting_library';
const LOCAL_DATA_CHART_KEY = 'data-chart';

export const saveLocalChart = (dataChart: any) => {
  const symbol = dataChart.charts[0].panes[0].sources[0].state.symbol;
  const storageCharts = parseJson(localStorage.getItem(LOCAL_DATA_CHART_KEY) || '');
  if (!storageCharts) {
    const InitStorageChart = [];
    InitStorageChart.push({ key: symbol, dataChart });
    localStorage.setItem(LOCAL_DATA_CHART_KEY, JSON.stringify(InitStorageChart));
  } else {
    const storagedChartIndex = storageCharts.findIndex((chart: { key: string }) => chart.key === symbol);
    if (storagedChartIndex < 0) {
      storageCharts.push({ key: symbol, dataChart });
    } else {
      storageCharts[storagedChartIndex].dataChart = dataChart;
    }
    localStorage.setItem(LOCAL_DATA_CHART_KEY, JSON.stringify(storageCharts));
  }
};
export const loadLocalChart = (widget: IChartingLibraryWidget, symbol: string) => {
  const storageCharts = parseJson(localStorage.getItem(LOCAL_DATA_CHART_KEY) || '');
  if (storageCharts) {
    const storgedChartIndex = storageCharts.findIndex((chart: { key: string }) => chart.key === symbol);
    if (storgedChartIndex >= 0) {
      widget.load(storageCharts[storgedChartIndex].dataChart);
    }
  }
};
