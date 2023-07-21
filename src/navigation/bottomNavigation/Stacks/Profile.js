import {createStackNavigator} from 'react-navigation-stack';
import PersonalInformationScreen from '../../../screens/PersonalInformationScreen';
import PointScreen from '../../../screens/PointScreen';
import Wallet from './Wallet';
import MyOrdersScreen from '../../../screens/MyOrdersScreen';
import MyFavorites from '../../../screens/MyFavorites';
import AdressesScreen from '../../../screens/AdressesScreen';

const ProfileStackNavigator = createStackNavigator({
  PersonalInformationScreen: {
    screen: PersonalInformationScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerShown: false,
    }),
  },
  Wallet: {
    screen: Wallet,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerShown: false,
    }),
  },
  PointScreen: {
    screen: PointScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
    }),
  },
  MyOrdersScreen: {
    screen: MyOrdersScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
    }),
  },
  MyFavorites: {
    screen: MyFavorites,
    navigationOptions: () => ({
      gestureEnabled: false,
    }),
  },
  AdressesScreen: {
    screen: AdressesScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
    }),
  }
});

ProfileStackNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      tabBarVisible = false;
    });
  }
  return {
    tabBarVisible,
  };
};

export default ProfileStackNavigator;
