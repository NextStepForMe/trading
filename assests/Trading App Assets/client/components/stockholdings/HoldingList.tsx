import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import HoldingListItem from './HoldingListItem';

interface HoldingProps {
  data: Record<string, any>;
}

const HoldingList: FC<HoldingProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn}>
          <CustomText variant="h9" fontFamily={FONTS.Medium}>
            Current (Invested)
          </CustomText>
        </TouchableOpacity>
      </View>

      {data?.map((item: any, index: number) => {
        return <HoldingListItem key={index} item={item} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  arrowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignSelf: 'flex-end',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default HoldingList;
