import { useEffect, useState } from 'react';
import TouchableText from '../auth/TouchableText';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';

interface DiamondOTPInputProps {
  otpValues: any;
  error?: string | null;
  loading: boolean;
  onForgotPin: () => void;
}

const DiamondOTPInput: React.FC<DiamondOTPInputProps> = ({
  error,
  otpValues,
  loading,
  onForgotPin,
}) => {
  const { colors } = useTheme();

  const [animatedValues] = useState(() =>
    Array.from({ length: otpValues.length }, () => new Animated.Value(1)),
  );

  useEffect(() => {
    if (loading) {
      startAnimation();
    } else {
      resetAnimation();
    }
  }, [loading]);

  const startAnimation = () => {
    Animated.loop(
      Animated.stagger(
        100,
        animatedValues.map(val =>
          Animated.sequence([
            Animated.timing(val, {
              toValue: 0.8,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 1,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    ).start();
  };

  const resetAnimation = () => {
    animatedValues.forEach(val => val.setValue(1));
  };

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

  const size = RFValue(20); // diamond size
  const half = size / 2;

  const diamondPoints = `${half},0 ${size},${half} ${half},${size} 0,${half}`;

  return (
    <>
      <View style={styles.container}>
        {otpValues?.map((text: string, index: number) => (
          <Animated.View
            key={index}
            style={{
              transform: [
                { translateX: shakeAnimation },
                { scale: animatedValues[index] },
              ],
            }}
          >
            <Svg height={size} width={size}>
              <Polygon
                points={diamondPoints}
                stroke={colors.text}
                strokeWidth={2}
                fill={otpValues[index] !== '' ? colors.text : 'transparent'}
              />
            </Svg>
          </Animated.View>
        ))}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableText
            firstText="Forgot PIN?"
            onPress={() => onForgotPin()}
            style={{ fontFamily: FONTS.Regular }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
    width: '60%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    gap: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  errorText: {
    color: Colors.errorColor,
    fontSize: RFValue(11),
    fontFamily: FONTS.Regular,
  },
});

export default DiamondOTPInput;
