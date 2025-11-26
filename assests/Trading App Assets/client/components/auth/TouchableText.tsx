import {
  View,
  Text,
  TextStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FONTS } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';

const TouchableText: React.FC<{
  firstText: string;
  style?: TextStyle;
  onPress?: () => void;
}> = ({ firstText, style, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.bottomText, { color: Colors.active_tab }, style]}>
        {firstText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    fontFamily: FONTS.Medium,
    fontSize: RFPercentage(1.6),
    textDecorationLine: 'underline',
  },
});

export default TouchableText;
