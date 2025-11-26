import { View, Text } from 'react-native';
import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

interface MiniChartsProps {
  color: string;
  stockData: any;
}

const MiniChart: FC<MiniChartsProps> = ({ color, stockData }) => {
  const containerWidth = 80;
  const containerHeight = 20;

  if (!stockData || stockData.length === 0) {
    return null;
  }

  const closes =
    stockData?.dayTimeSeries?.slice(-20).map((d: any) => d.close) || [];

  const maxValue = Math.max(...closes);
  const minValue = Math.min(...closes);

  const scaleYChart = (value: number) => {
    return (
      containerHeight -
      ((value - minValue) / (maxValue - minValue)) * containerHeight
    );
  };

  const stepX = containerWidth / (closes.length - 1);

  const pathData =
    `M0,${scaleYChart(closes[0])}` +
    closes
      .slice(1)
      .map(
        (point: number, index: number) =>
          ` L${(index + 1) * stepX},${scaleYChart(point)}`,
      )
      .join('');

  return (
    <View>
      <Svg width={containerWidth} height={containerHeight}>
        {/* Line Path */}
        <Path d={pathData} stroke={color} strokeWidth="2" fill="none" />

        {/* Midline */}
        <Path
          d={`M0 ${containerHeight / 2} L${containerWidth} ${
            containerHeight / 2
          }`}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
      </Svg>
    </View>
  );
};

export default MiniChart;
