import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { useTheme } from '@react-navigation/native';
import {
  formatPaisaWithCommas,
  getSignPaisa,
  getSignText,
} from '../../utils/NumberUtils';
import MiniChart from './MiniChart';
import { useWS } from '../../utils/WSProvider';
import { navigate } from '../../utils/NavigationUtil';

interface WatchListItemProps {
  item: Record<string, any>;
}

const subscribedSymbols = new Set<string>();

const MiniStockListItem: FC<WatchListItemProps> = ({ item }) => {
  const { colors } = useTheme();
  const socketService = useWS();
  const [stockData, setStockData] = useState<any>([]);

  useEffect(() => {
    if (socketService && item?.symbol) {
      if (!subscribedSymbols.has(item.symbol)) {
        socketService.emit('subscribeToStocks', item.symbol);
        subscribedSymbols.add(item.symbol);
      }

      socketService.on(item.symbol, data => {
        setStockData(data);
      });

      return () => {
        socketService.off(item.symbol);
        subscribedSymbols.delete(item.symbol);
      };
    }
  }, [item.symbol, socketService]);

  const priceChange = item.currentPrice - item.lastDayTradedPrice;
  const percentageChange = Math.abs(
    (priceChange / item.lastDayTradedPrice) * 100,
  ).toFixed(2);

  const handlePress = () => {
    const { tenMinTimeSeries, dayTimeSeries, ...stockWithoutTimeSeries } =
      item as any;
    navigate('TradingView', { stock: stockWithoutTimeSeries });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, { borderColor: colors.border }]}
    >
      <View style={{ width: '40%' }}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          {item.companyName}
        </CustomText>
      </View>

      <MiniChart
        stockData={stockData}
        color={getSignPaisa(priceChange).color}
      />

      <View style={{ alignItems: 'flex-end' }}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          {formatPaisaWithCommas(item.currentPrice)}
        </CustomText>

        <CustomText
          style={{
            marginVertical: 5,
            color: getSignPaisa(priceChange).color,
          }}
          variant="h9"
          fontFamily={FONTS.Bold}
        >
          {getSignText(priceChange)} ({percentageChange})
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
    paddingVertical: 18,
    borderBottomWidth: Platform.OS === 'android' ? 1.5 : 1,
  },
});

export default MiniStockListItem;
