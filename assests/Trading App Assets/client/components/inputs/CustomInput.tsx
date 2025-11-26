import { JSX, useState } from 'react';
import { Platform, StyleSheet, TextInput, TextStyle,Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';

interface InputProps {
  label?: string;
  iconName?: string;
  error?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  rightText?: JSX.Element;
  disabled?: boolean;
  disabledBackground?: boolean;
  password?: boolean;
  textTop?: boolean;
  containerStyle?: TextStyle;
  required?: boolean;
  textInputStyle?: TextStyle;
  onFocus?: () => void;
}

const CustomInput: React.FC<
  InputProps & React.ComponentProps<typeof TextInput>
> = ({
  label,
  iconName,
  error,
  rightIcon,
  leftIcon,
  disabled,
  disabledBackground,
  password,
  rightText,
  textTop,
  required,
  containerStyle,
  textInputStyle,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hideEyeIcon, setHideEyeIcon] = useState(true);

  return (
    <View style={styles.inputMainContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: Colors.text, opacity: 1 }]}>
            {label} {required && '*'}
          </Text>
          {rightText}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? Colors.errorColor
              : isFocused
              ? Colors.themeColor
              : Colors.border,
            borderWidth: isFocused ? 2 : 1,
            borderRadius: isFocused ? 8 : 6,
            backgroundColor: isFocused ? '#1E293B' : 'transparent',
          },
          containerStyle,
        ]}
      >
        {leftIcon}
        <TextInput
          placeholderTextColor="#dadbde"
          style={[
            styles.textInput,
            {
              textAlignVertical: textTop ? 'top' : 'center',
              color: Colors.text,
            },
            textInputStyle,
          ]}
          secureTextEntry={password ? hideEyeIcon : false}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          maxLength={256}
          editable={!disabled}
          onBlur={() => {
            setIsFocused(false);
          }}
          {...props}
        />
        {rightIcon}

        {password && (
          <Icon
            size={RFValue(12)}
            onPress={() => {
              setHideEyeIcon(!hideEyeIcon);
            }}
            name={!hideEyeIcon ? 'eye' : 'eye-off'}
            style={styles.password}
            color={Colors.text}
          />
        )}
      </View>

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
  );
};

const styles = StyleSheet.create({
  inputMainContainer: {
    marginVertical: 12,
  },
  label: {
    fontSize: Platform.OS === 'ios' ? RFValue(10) : RFValue(10),
    fontFamily: FONTS.Medium,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    fontFamily: FONTS.Regular,
    fontSize: Platform.OS === 'ios' ? RFValue(12) : RFValue(14),
    alignItems: 'flex-start',
    height: 32,
    width: '80%',
    paddingVertical: 6,
  },
  password: {
    textAlignVertical: 'center',
    opacity: 0.8,
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
});

export default CustomInput;
