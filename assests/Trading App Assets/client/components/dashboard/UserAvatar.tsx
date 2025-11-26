import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppSelector } from '../../redux/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import CustomText from '../global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';

import { navigate } from '../../utils/NavigationUtil';

interface UserAvatarProps {
  style?: ImageStyle;
}

const pic =
  'https://deadline.com/wp-content/uploads/2024/01/Ne-Zha-2-billion_0ed5f3.jpeg';

const UserAvatar: React.FC<UserAvatarProps> = ({ style }) => {
  const user = useAppSelector(selectUser);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ProfileScreen');
      }}
    >
      {pic ? (
        <Image
          source={{
            uri: pic,
          }}
          style={[styles.img, style]}
        />
      ) : (
        <View style={[styles.img, style]}>
          <CustomText variant="h8" fontFamily={FONTS.Bold}>
            {user?.name?.split(' ')[0].charAt(0)}
            {user?.name?.split(' ')[1].charAt(0)}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  img: {
    borderRadius: 20,
    justifyContent: 'center',
    width: RFValue(28),
    height: RFValue(28),
    alignItems: 'center',
    resizeMode: 'cover',
    marginLeft: 8,
    backgroundColor: Colors.themeColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
});
export default UserAvatar;
