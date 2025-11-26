import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { selectHoldings } from '../../redux/reducers/stockSlice';
import { getAllHoldings } from '../../redux/actions/stockAction';
import { Colors } from '../../constants/Colors';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { screenHeight } from '../../utils/Scaling';
import HoldingCard from './HoldingCard';
import HoldingList from './HoldingList';

const Holdings = () => {
  const dispatch = useAppDispatch();
  const holdingData = useAppSelector(selectHoldings);

  const fetchHoldings = async () => {
    await dispatch(getAllHoldings());
  };

  const [refreshing, setRefreshing] = useState(false);

  const refreshHandler = async () => {
    await fetchHoldings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          onRefresh={refreshHandler}
          refreshing={refreshing}
          tintColor={Colors.profit}
        />
      }
    >
      {holdingData.length !== 0 ? (
        <>
          <CustomText
            variant="h6"
            style={styles.sectionContainer}
            fontFamily={FONTS.Medium}
          >
            Holdings ({holdingData.length})
          </CustomText>
          <HoldingCard data={holdingData} />
          <HoldingList data={holdingData} />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            name="pie-chart-outline"
            size={screenHeight * 0.12}
            color={Colors.active_tab}
          />
          <CustomText
            variant="h5"
            style={styles.subText}
            fontFamily={FONTS.Medium}
          >
            You have no holdings
          </CustomText>
          <CustomText variant="h8" fontFamily={FONTS.Regular}>
            Make your next investment
          </CustomText>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 15,
    marginTop: 16,
    paddingRight: 4,
  },
  subText: {
    marginVertical: 25,
    marginTop: 30,
  },
  emptyContainer: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Holdings;
