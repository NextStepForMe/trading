import { View, Image, StyleSheet } from "react-native";
import React from "react";
import Logo from "../../assets/images/logo_text.png";
import { RFValue } from "react-native-responsive-fontsize";

const CenteredLogo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image style={styles.img} source={Logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    flexDirection: "row",
  },
  imgContainer: {
    width: RFValue(140),
    height: RFValue(40),
  },
  img: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
});

export default CenteredLogo;
