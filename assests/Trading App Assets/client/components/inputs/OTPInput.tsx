import { View, Text, Animated, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import CustomText from '../global/CustomText';
import Icon2 from "react-native-vector-icons/Ionicons";

interface OTPInputProps {
  otpValues: any;
  focusedIndex: number;
  error?: string | null;
}

const OTPInput: React.FC<OTPInputProps> = ({
  error,
  otpValues,
  focusedIndex,
}) => {
  const { colors } = useTheme();
  const [shakeAnimation] = useState(new Animated.Value(0));
  useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <>
      <View style={styles.container}>
        {otpValues?.map((text: string, index: number) => (
          <Animated.View
            key={index}
            style={[
              styles.inputBox,
              {
                borderColor: error
                  ? Colors.errorColor
                  : focusedIndex === index
                  ? Colors.themeColor
                  : otpValues[index] !== ''
                  ? Colors.themeColor
                  : '#475569',
                borderWidth: focusedIndex === index ? 2.5 : 1.5,
                transform: [{ translateX: shakeAnimation }],
              },
            ]}
          >
            <CustomText
              style={{
                color:
                  otpValues[index] !== '' ? Colors.themeColor : colors.text,
              }}
              fontFamily={FONTS.Number}
              variant="h5"
            >
              {text}
            </CustomText>
          </Animated.View>
        ))}

        {error && (
          <View style={styles.errorContainer}>
            <Icon2
              size={RFValue(13)}
              name="information-circle"
              style={styles.errorText}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 5,
  },
  errorText: {
    color: Colors.errorColor,
    fontSize: Platform.OS === 'ios' ? RFValue(11) : RFValue(11),
    fontFamily: FONTS.Medium,
  },
  inputBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    width: 55,
    height: 55,
    marginRight: 8,
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
});

export default OTPInput;
