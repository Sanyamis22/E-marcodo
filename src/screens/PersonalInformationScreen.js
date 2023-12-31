import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../common/HeaderCustom';
import themeStyle from '../common/Theme.style';

const PersonalInformationScreen = ({navigation}) => {
  const language = useSelector(state => state.appConfig.languageJson);
  return (
    <View style={{flex: 1, backgroundColor: themeStyle.primaryBackgroundColor}}>
      <Header
        menuIcon={true}
        cartIcon={true}
        navigation={navigation}
        backIcon={true}
        name={language['My Wish List']}
        searchIcon={true}
      />
      <View style={{padding: 25, marginTop: 20}}>
        <TouchableOpacity key={0} style={{}} onPress={() => {}}>
          <View
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              shadowOffset: 2,
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 50, height: 65, backgroundColor: 'white'}}
              source={require('../images/newImages/profile_yellow.png')}
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Personal Information
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={1}
          style={{}}
          onPress={() => navigation.navigate('AdressesScreen', {})}>
          <View
            key={1}
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 50, height: 65}}
              source={require('../images/newImages/location_yellow.png')}
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Address
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={2}
          style={{}}
          onPress={() => navigation.navigate('Wallet', {})}>
          <View
            key={2}
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              shadowOffset: 2,
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 50, height: 65, backgroundColor: 'white'}}
              source={require('../images/newImages/wallet_yellow.png')}
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Wallet
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={2}
          style={{}}
          onPress={() => navigation.navigate('MyOrdersScreen', {})}>
          <View
            key={2}
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              shadowOffset: 2,
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 50, height: 65, backgroundColor: 'white'}}
              source={require('../images/newImages/order_yellow.png')}
              resizeMethod="auto"
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Order
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={{}} onPress={() => {}}>
          <View
            key={3}
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              shadowOffset: 2,
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 60, height: 65, backgroundColor: 'white'}}
              source={require('../images/newImages/history_yellow.png')}
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              History
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={4}
          style={{}}
          onPress={() => navigation.navigate('MyFavorites', {})}>
          <View
            key={4}
            style={{
              shadowRadius: 5,
              shadowColor: 'balck',
              shadowOffset: 2,
              elevation: 2,
              opacity: 1,
              flexDirection: 'row',
              marginBottom: 10,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{width: 50, height: 65}}
              source={require('../images/newImages/wishlist_yellow.png')}
            />
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                alignSelf: 'center',
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Wish list
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalInformationScreen;
