import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FONTS } from '../../constants/Fonts';
import CustomText from '../global/CustomText';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import TouchableText from '../auth/TouchableText';
import { checkBiometrics } from '../../utils/BiometricUtils';

interface NumberPadProps {
  onPressNumber: (number: number | string) => void;
  onPressBackspace: () => void;
  onPressCheckmark: () => void;
  isBiometric?: boolean;
  customFont?: boolean;
  themeColor?: boolean;
  onPressBiometric?: () => void;
}

const CustomNumberPad: React.FC<NumberPadProps> = ({
  onPressNumber,
  onPressBackspace,
  onPressCheckmark,
  isBiometric,
  customFont,
  themeColor,
  onPressBiometric,
}) => {
  const [biometricType, setBiometricType] = useState<string | null>();
  useEffect(() => {
    checkBiometrics().then(bt => {
      setBiometricType(bt);
    });
  }, []);

  const renderButton = (label: string | number, onPress: () => void) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <CustomText
        variant="h2"
        fontFamily={
          customFont || themeColor ? FONTS.Lato : FONTS.NumberSemiBold
        }
        style={
          (styles.buttonText,
          {
            color: isBiometric || themeColor ? Colors.themeColor : Colors.text,
          })
        }
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );

  const renderIconButton = (icon: string, onPress: () => void) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon
        name={icon}
        size={RFValue(22)}
        color={themeColor || isBiometric ? Colors.themeColor : Colors.text}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isBiometric && biometricType && (
        <TouchableText
          style={styles.touchText}
          onPress={onPressBiometric}
          firstText={`Use ${
            biometricType == 'Biometrics' ? 'Fingerprint' : biometricType
          }`}
        />
      )}

      <View style={styles.row}>
        {renderButton(1, () => onPressNumber(1))}
        {renderButton(2, () => onPressNumber(2))}
        {renderButton(3, () => onPressNumber(3))}
      </View>
      <View style={styles.row}>
        {renderButton(4, () => onPressNumber(4))}
        {renderButton(5, () => onPressNumber(5))}
        {renderButton(6, () => onPressNumber(6))}
      </View>
      <View style={styles.row}>
        {renderButton(7, () => onPressNumber(7))}
        {renderButton(8, () => onPressNumber(8))}
        {renderButton(9, () => onPressNumber(9))}
      </View>
      <View style={styles.row}>
        {renderIconButton(
          isBiometric || themeColor ? 'backspace' : 'backspace-outline',
          onPressBackspace,
        )}
        {renderButton(0, () => onPressNumber(0))}
        {renderIconButton('checkmark-sharp', onPressCheckmark)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  touchText: {
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    borderRadius: 16,
    borderWidth: 1,
    width: '32%',
    borderColor: '#333',
    height: 60,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
  },
});
export default CustomNumberPad;
