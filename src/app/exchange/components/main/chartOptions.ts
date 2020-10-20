export const chartOptions = {
  backgroundColor: 'transparent',
  responsive: true,
  tooltip: {
    show: false
  },
  grid: { // https://echarts.apache.org/en/option.html#grid
    left: '10px', // Distance between grid component and the left side of the container.
    right: '0px',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      show: false,
      lineStyle: {
        backgroundColor: 'white'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      showMinLabel: false,
      fontFamily: 'IBM Plex Sans, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '20',
      color: '#353A3E',
      rotate: 0,
    }
  },
  yAxis: {
    type: 'value',
    position: 'right',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      showMinLabel: false,
      fontFamily: 'IBM Plex Sans, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '20',
      color: '#353A3E',
      inside: true,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(34, 207, 99, 0.12)',
        type: 'dashed'
      }
    },
    min: 0
  },
  series: [],
  color: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
      offset: 0, color: 'rgba(23, 199, 89, 0.15)' // color at 0% position
    }, {
      offset: 1, color: 'rgba(30, 182, 87, 0.01)' // color at 100% position
    }],
    global: false // false by default
  }
};
