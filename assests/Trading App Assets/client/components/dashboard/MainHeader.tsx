import { View, Text, Animated, Easing, StyleSheet, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Logo from '../../assets/images/logo.png';
import UserAvatar from './UserAvatar';

const MainHeader = () => {
  const fallAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    Animated.timing(fallAnim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.flexRowCenter}>
        <Image source={Logo} style={styles.img} />
      </View>

      <Animated.Image
        source={require("../../assets/images/bull.png")}
        style={[
          styles.middleImg,
          { transform: [{ translateY: fallAnim }] },
        ]}
      />

      <View style={styles.flexRowCenter}>
        <UserAvatar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRowCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: RFValue(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    height: RFValue(60),
  },
  img: {
    width: RFValue(40),
    height: RFValue(40),
    resizeMode: 'cover',
  },
  middleImg: {
    width: RFValue(120),
    height: RFValue(120),
    resizeMode: 'contain',
    position: 'absolute',
    top: -35,
    left: '55%',
    marginLeft: -RFValue(60),
  },
});

export default MainHeader;
