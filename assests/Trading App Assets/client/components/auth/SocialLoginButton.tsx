import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';

interface SocialLoginButtonProps {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
}

const SocialLoginButton: FC<SocialLoginButtonProps> = ({
  icon,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {icon}
      <CustomText variant="h8" fontFamily={FONTS.Medium} style={styles.text}>
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    marginLeft: 12,
    color: Colors.text,
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 16,
    width: '100%',
    marginVertical: 12,
    backgroundColor: Colors.sub_background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SocialLoginButton;
