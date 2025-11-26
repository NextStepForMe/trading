import { RefreshControl, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/Colors';
import MiniStockListItem from './MiniStockListItem';

interface MiniStockListProps {
  data: any[];
}

const MiniStockList: React.FC<MiniStockListProps> = ({ data }) => {
  const [refreshing, setRefreshing] = useState(false);

  const refreshHandler = async () => {
    setRefreshing(false);
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          onRefresh={refreshHandler}
          refreshing={refreshing}
          colors={[Colors.themeColor]}
          tintColor={Colors.themeColor}
        />
      }
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <MiniStockListItem item={item} />}
    />
  );
};

export default MiniStockList;
