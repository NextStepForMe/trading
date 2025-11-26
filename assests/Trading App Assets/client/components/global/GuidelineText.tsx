import { View, Text, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { useTheme } from '@react-navigation/native';
import CustomText from './CustomText';
import { FONTS } from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

interface GuidelineTextProps {
  text: any;
}

const GuidelineText: FC<GuidelineTextProps> = ({ text }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: '#46391d' }]}>
      <Icon
        name="information-circle"
        size={RFValue(16)}
        style={[styles.text, { color: colors.text }]}
      />
      <View style={styles.textContainer}>
        {text?.map((i: string, index: number) => {
          return (
            <CustomText
              key={index}
              fontFamily={FONTS.Regular}
              style={styles.text}
              variant="h9"
            >
              {i}
            </CustomText>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  textContainer: {
    width: '90%',
  },
  text: {
    opacity: 0.7,
    marginBottom: 5,
  },
});

export default GuidelineText;
