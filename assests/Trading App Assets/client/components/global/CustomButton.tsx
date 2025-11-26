import { useTheme } from '@react-navigation/native';
import { FC, useEffect, useState } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import TouchableRipple from 'react-native-material-ripple';
import { Colors } from '../../constants/Colors';
import CustomText from './CustomText';
import { FONTS } from '../../constants/Fonts';

interface CustomButtonProps {
  text: string;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const CustomButton: FC<CustomButtonProps> = ({
  text,
  loading,
  disabled,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (loading) {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      animatedValue.stopAnimation();
    }
  }, [loading]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-500, 500],
  });
  return (
    <TouchableRipple
      disabled={disabled}
      onPress={onPress}
      rippleColor="#fff"
      style={[
        styles.btn,
        {
          backgroundColor: loading || disabled ? colors.card : Colors.profit,
        },
        style,
      ]}
    >
      <CustomText
        fontFamily={FONTS.Bold}
        variant="h6"
        style={{ color: 'white' }}
      >
        {text}
      </CustomText>
      {loading && (
        <Animated.View
          style={[
            styles.loadingIndicator,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: '#8B5CF6',
    width: '100%',
  },
});

export default CustomButton;
