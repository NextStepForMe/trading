import React, { FC, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { useTheme } from '@react-navigation/native';
import { formatPaisaWithCommas, getSignPaisa } from '../../utils/NumberUtils';

import { useWS } from '../../utils/WSProvider';
import MiniChart from '../stocks/MiniChart';
import { navigate } from '../../utils/NavigationUtil';

interface HoldingListItemProps {
  item: Record<string, any>;
}

type Stock = {
  __v: number;
  _id: string;
  companyName: string;
  currentPrice: number;
  iconUrl: string;
  lastDayTradedPrice: number;
  symbol: string;
  dayTimeSeries: Array<TimeSeries>;
  tenMinTimeSeries: Array<TimeSeries>;
};

type TimeSeries = {
  _internal_originalTime: number;
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  timestamp: string;
};

const HoldingListItem: FC<HoldingListItemProps> = ({ item }) => {
  const { colors } = useTheme();
  const [stockSocketData, setStockSocketData] = useState<Stock | null>(null);
  const socketService = useWS();

  const invested = useMemo(
    () => item.buyPrice * item.quantity,
    [item.buyPrice, item.quantity],
  );
  const currentStockPrice =
    stockSocketData?.currentPrice ?? item.stock.currentPrice;
  const currentValue = useMemo(
    () => currentStockPrice * item.quantity,
    [currentStockPrice, item.quantity],
  );
  const isProfit = useMemo(
    () => currentValue - invested,
    [currentValue, invested],
  );

  useEffect(() => {
    if (socketService) {
      socketService.emit('subscribeToStocks', item.stock.symbol);

      socketService.on(item.stock.symbol, (data: Stock) => {
        console.log(data);
        setStockSocketData(data);
      });

      return () => {
        socketService.off(item.stock.symbol);
      };
    }
  }, [item.stock.symbol, socketService]);

  const handlePress = () => {
    const { tenMinTimeSeries, dayTimeSeries, ...stockWithoutTimeSeries } =
      stockSocketData as any;
    navigate('TradingView', { stock: stockWithoutTimeSeries });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, { borderColor: colors.border }]}
    >
      <View style={{ width: '40%' }}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          {item.stock.companyName}
        </CustomText>
        <CustomText
          style={{ opacity: 0.7, marginVertical: 5 }}
          variant="h9"
          fontFamily={FONTS.Medium}
        >
          {item.quantity} shares
        </CustomText>
      </View>

      {stockSocketData && (
        <MiniChart
          stockData={stockSocketData}
          color={getSignPaisa(isProfit).color}
        />
      )}

      <View style={{ alignItems: 'flex-end' }}>
        <CustomText
          variant="h8"
          fontFamily={FONTS.Medium}
          style={{ color: getSignPaisa(isProfit).color }}
        >
          {getSignPaisa(isProfit).paisa.slice(0, 1) +
            getSignPaisa(currentValue).paisa.slice(1)}
        </CustomText>

        <CustomText
          style={{ opacity: 0.7, marginVertical: 5 }}
          variant="h9"
          fontFamily={FONTS.Medium}
        >
          ({formatPaisaWithCommas(invested)})
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 1,
  },
});

export default HoldingListItem;
