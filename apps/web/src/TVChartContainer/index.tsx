import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  Timezone,
  IChartingLibraryWidget,
} from '../../public/static/charting_library';
import { apiBaseUrl, isServer, USER_COOKIES } from 'utils/constant';
import { useTheme } from 'next-themes';
import * as saveLoadAdapter from './saveLoadAdapter';
import { loadLocalChart, saveLocalChart } from './saveLoadChart';
import { getCookies, setCookies } from '@cross/cookies';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  overrides: any;
  locale: ChartingLibraryWidgetOptions['locale'];
  preset: ChartingLibraryWidgetOptions['preset'];
  header_widget_buttons_mode: ChartingLibraryWidgetOptions['header_widget_buttons_mode'];
  save_load_adapter: ChartingLibraryWidgetOptions['save_load_adapter'];
}

export interface ChartContainerState {}

// function getLanguageFromURL(): LanguageCode | null {
//   const regex = new RegExp("[\\?&]lang=([^&#]*)");
//   const results = regex.exec(location.search);
//   return results === null
//     ? null
//     : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
// }

function getTimeZone() {
  const nowDate = new Date();
  const offset = -(nowDate.getTimezoneOffset() / 60);
  const timezoneArr = [
    {
      type: 'America/Sao_Paulo',
      value: -2,
    },
    {
      type: 'America/Argentina/Buenos_Aires',
      value: -3,
    },
    {
      type: 'America/Caracas',
      value: -4,
    },
    {
      type: 'America/New_York',
      value: -5,
    },
    {
      type: 'America/Chicago',
      value: -6,
    },
    {
      type: 'America/Phoenix',
      value: -7,
    },
    {
      type: 'America/Vancouver',
      value: -8,
    },
    {
      type: 'Pacific/Honolulu',
      value: -10,
    },
    {
      type: 'Pacific/Fakaofo',
      value: -11,
    },
    {
      type: 'Europe/London',
      value: 0,
    },
    {
      type: 'Europe/Paris',
      value: 1,
    },
    {
      type: 'Europe/Athens',
      value: 2,
    },
    {
      type: 'Europe/Moscow',
      value: 3,
    },
    {
      type: 'Asia/Dubai',
      value: 4,
    },
    {
      type: 'Asia/Ashkhabad',
      value: 5,
    },
    {
      type: 'Asia/Almaty',
      value: 6,
    },
    {
      type: 'Asia/Bangkok',
      value: 7,
    },
    {
      type: 'Asia/Kathmandu',
      value: 5.75,
    },
    {
      type: 'Asia/Kolkata',
      value: 5.5,
    },
    {
      type: 'Asia/Shanghai',
      value: 8,
    },
    {
      type: 'Asia/Tehran',
      value: 4.5,
    },
    {
      type: 'Asia/Tokyo',
      value: 9,
    },
    {
      type: 'Australia/ACT',
      value: 9.5,
    },
    {
      type: 'Australia/Sydney',
      value: 10,
    },
    {
      type: 'Pacific/Auckland',
      value: 12,
    },
    {
      type: 'Pacific/Chatham',
      value: 13,
    },
  ];
  let timeZone = 'Europe/Moscow';

  timezoneArr.forEach((zone) => {
    if (zone.value === offset) {
      timeZone = zone.type;
    }
  });

  return timeZone;
}

interface TVChartContainerProps {
  interval?: string;
  symbol?: string;
  onIntervalChange?: (interval: ResolutionString) => void;
  locale: LanguageCode;
  isMobile?: boolean;
}
const TVChartContainer: React.FC<TVChartContainerProps> = ({
  symbol,
  interval,
  locale,
  isMobile,
  onIntervalChange,
}) => {
  const { theme } = useTheme();

  const defaultProps: ChartContainerProps = {
    symbol: symbol && symbol !== '' ? symbol : 'BTC_USDT',
    interval: (getCookies(USER_COOKIES.resolution) as any) ?? ('60' as ResolutionString),
    containerId: 'tv_chart_container',
    libraryPath: '/static/charting_library/',
    datafeedUrl: apiBaseUrl,
    chartsStorageUrl: apiBaseUrl,
    chartsStorageApiVersion: '1.1',
    clientId: 'koindex.io',
    userId: 'koindex',
    fullscreen: false,
    autosize: true,
    locale: 'en',
    preset: isMobile ? 'mobile' : undefined,
    header_widget_buttons_mode: 'fullsize',
    studiesOverrides: { SYMBOL_STRING_DATA: 'line' },
    overrides: {
      'scalesProperties.fontSize': isMobile ? 10 : 12,
    },
    save_load_adapter: saveLoadAdapter as any,
  };
  const [activeChart, setActiveChart] = useState<any>(null);
  const [chartWidget, setChartWidget] = useState<IChartingLibraryWidget>();

  useEffect(() => {
    if (isServer()) return;
    if (symbol && activeChart === null) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: symbol ?? defaultProps.symbol,
        interval: (interval ?? defaultProps.interval) as ChartingLibraryWidgetOptions['interval'],
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
        container: defaultProps.containerId as ChartingLibraryWidgetOptions['container'],
        library_path: defaultProps.libraryPath,
        locale: locale,
        disabled_features: [
          'use_localstorage_for_settings',
          'volume_force_overlay',
          'timeframes_toolbar',
          'display_market_status',
          // 'context_menus',
          'header_symbol_search',
          'header_widget_dom_node',
          'header_compare',
          'header_widget_dom_node',
          'header_fullscreen_button',
          'timeframes_toolbar',
        ],
        enabled_features: isMobile ? ['hide_left_toolbar_by_default'] : [],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: defaultProps.chartsStorageApiVersion,
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
        theme: 'Dark',
        numeric_formatting: {
          decimal_sign: '.',
        },
        overrides: defaultProps.overrides,
        timezone: getTimeZone() as Timezone,
        save_load_adapter: saveLoadAdapter as any,
      };
      const w = new widget(widgetOptions);

      w.onChartReady(() => {
        w.activeChart().setResolution(interval as ResolutionString, () => {});
        setActiveChart(w.activeChart());
        setChartWidget(w);
        w.activeChart()
          .getPanes()?.[1]
          ?.setHeight(isMobile ? 0 : 120);
        loadLocalChart(w, symbol);
        w.subscribe('onAutoSaveNeeded', () => {
          w.save((dataChart) => {
            saveLocalChart(dataChart);
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, activeChart, locale, theme, isMobile]);

  useEffect(() => {
    if (activeChart) {
      activeChart.setResolution(interval as ResolutionString, () => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  useEffect(() => {
    if (activeChart) {
      activeChart.setSymbol(symbol, () => {});
    }
  }, [symbol, activeChart]);

  useEffect(() => {
    if (isServer()) return;
    if (chartWidget) {
      chartWidget.changeTheme(theme === 'light' ? 'Light' : 'Dark', {
        disableUndo: true,
      });
      setTimeout(() => {
        const positiveColor = theme === 'light' ? '#12cea3' : '#00FE9A';
        chartWidget.applyOverrides({
          'mainSeriesProperties.style': 1,
          volumePaneSize: 'small',
          'mainSeriesProperties.candleStyle.upColor': positiveColor,
          'mainSeriesProperties.candleStyle.downColor': '#FF006A',
          'mainSeriesProperties.candleStyle.borderColor': positiveColor,
          'mainSeriesProperties.candleStyle.borderUpColor': positiveColor,
          'mainSeriesProperties.candleStyle.borderDownColor': '#FF006A',
          'mainSeriesProperties.candleStyle.wickUpColor': positiveColor,
          'mainSeriesProperties.candleStyle.wickDownColor': '#FF006A',
          'mainSeriesProperties.barStyle.upColor': positiveColor,
          'mainSeriesProperties.barStyle.downColor': '#FF006A',
        });
      }, 200);
    }
  }, [theme, chartWidget]);

  useEffect(() => {
    if (!activeChart) return;
    activeChart.onIntervalChanged().subscribe(null, function (nInterval: ResolutionString) {
      if (onIntervalChange) onIntervalChange(nInterval);
      setCookies(USER_COOKIES.resolution, nInterval);
    });
  }, [activeChart]);

  return <div id={defaultProps.containerId} className={styles.TVChartContainer} />;
};

export default TVChartContainer;
