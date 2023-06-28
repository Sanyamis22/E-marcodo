import React, {PureComponent} from 'react';
import {
  StyleSheet, // Renders text
  View,
  Dimensions,
  I18nManager,
  Platform,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appConfigStyle, appTextStyle} from '../common/Theme.style';
import ShoppingCartIcon3 from '../common/ShoppingCartIcon3';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import RNRestart from 'react-native-restart';
import {createSelector} from 'reselect';
import {
  LANG_CODE,
  getLanguages,
  SET_LANGUAGE,
  SET_LANGUAGE_ID,
  CLEAR_LANGUAGES,
  GRID_FLAG,
} from '../redux/actions/actions';
import SelectDropdown from 'react-native-select-dropdown';
const WIDTH = Dimensions.get('window').width;
class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      categories: [
        'iPad',
        'Apple Display',
        'Mac',
        'Iphone',
        'HomePod',
        'AirTag',
        'AirPods',
        'Apple Watch',
        'Apple TV',
        'AirPod',
        'Shop By Brand',
        'Apple',
        'Electronic',
        'Home Appliances',
        'Kitchen Appliances',
      ],
    };
  }
  updateLanguage(item) {
    this.props.setLanguageIdFun(item.id);
    this.props.setLanguageCodeFun(item.code);
    if (item.direction === 'rtl') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    this.props.getTranslationData(item, this);
  }

  async componentDidMount() {
    this.props.clearLanguagesFun();
    this.props.getLanguageCall(this);
  }
  render(
    {
      name,
      cartIcon,
      backIcon,
      navigation,
      menuIcon,
      shadow,
      showGrid = true,
      searchIcon,
    } = this.props,
  ) {
    const parent = navigation.dangerouslyGetParent().state.index;
    const routeName = navigation.state.routeName;
    return (
      <View>
        <View
          style={[
            styles.headerView,
            {
              marginBottom: 0,
              backgroundColor: appConfigStyle.headerColor
                ? this.props.themeStyle.primary
                : this.props.themeStyle.primaryBackgroundColor,
            },
          ]}>
          {/* Left Top Bar (hamburger menu button or back button) */}
          <View>
            {(!menuIcon && backIcon && parent >= 0) ||
            routeName === 'CartScreen' ? (
              <Icon
                onPress={() => {
                  navigation.goBack();
                }}
                name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                style={{
                  color: appConfigStyle.headerColor
                    ? this.props.themeStyle.textTintColor
                    : this.props.themeStyle.textColor,
                  fontSize: 24,
                  padding: 5,
                  paddingHorizontal: 0,
                  zIndex: 12,
                  marginTop: Platform.OS === 'ios' ? -12 : -19,
                }}
              />
            ) : menuIcon ? null : (
              <View
                style={{
                  padding: 15,
                  paddingHorizontal: 0,
                  marginTop: -8,
                }}
              />
            )}
            {/* {(menuIcon && parent === 0 */}
            {menuIcon && parent >= 0 ? (
              <TouchableOpacity
                style={{
                  marginTop: Platform.OS === 'ios' ? -14 : -22,
                  zIndex: 40,
                }}
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}>
                {appConfigStyle.headerMenuImage ? (
                  <Image
                    style={{
                      height: 28,
                      width: 30,
                      tintColor: '#fff' /* this.props.themeStyle.primary */,
                    }}
                    source={require('../images/menu.png')}
                    onPress={() => {
                      this.props.navigation.openDrawer();
                    }}
                  />
                ) : (
                  <Icon
                    onPress={() => {
                      this.props.navigation.openDrawer();
                    }}
                    name={'menu'}
                    style={{
                      color: appConfigStyle.headerColor
                        ? this.props.themeStyle.textTintColor
                        : this.props.themeStyle.textColor,
                      fontSize: 24,
                      padding: 5,
                      paddingHorizontal: 0,
                    }}
                  />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
          {/* Right Top Bar */}
          <View
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Platform.OS === 'ios' ? -12 : -22,
              }}>
              {menuIcon ? (
                appConfigStyle.headerSearchBar ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SearchScreen');
                    }}
                    style={[
                      styles.iconStyle,
                      {
                        backgroundColor: this.props.themeStyle
                          .secondryBackgroundColor,
                        // width: !category ? WIDTH * 0.7 : WIDTH * 0.85
                        width: WIDTH * 0.7,
                        alignSelf: 'center',
                        marginTop: Platform.OS === 'android' ? -23 : -13,
                        paddingVertical: 6,
                        marginLeft: 9,
                      },
                    ]}>
                    <Ionicons
                      name={'search'}
                      style={{
                        color: this.props.themeStyle.iconPrimaryColor,
                        fontSize: 18,
                      }}
                    />
                    <Text
                      style={[
                        styles.textinputStyle,
                        {
                          // width: !category ? WIDTH * 0.6 : WIDTH * 0.75,
                          width: WIDTH * 0.6,
                          fontSize: appTextStyle.mediumSize,
                          color: this.props.themeStyle.iconPrimaryColor,
                          backgroundColor: this.props.themeStyle
                            .secondryBackgroundColor,
                        },
                      ]}>
                      {this.props.language['What are you looking for?']}
                    </Text>
                  </TouchableOpacity>
                ) : appConfigStyle.homeTitle === '' ? (
                  <View
                    style={{
                      width: WIDTH,
                      position: 'absolute',
                      paddingBottom: Platform.OS === 'IOS' ? 6 : 4,
                    }}>
                    <Image
                      resizeMode="contain"
                      key={0}
                      style={{
                        width: 70,
                        height: 30,
                        alignSelf: 'center',
                      }}
                      source={require('../images/header.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 100,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      resizeMode="contain"
                      key={1}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                      source={require('../images/icon.png')}
                    />
                    <Text
                      style={{
                        fontSize: appTextStyle.largeSize + 2,
                        color: appConfigStyle.headerColor
                          ? this.props.themeStyle.textTintColor
                          : this.props.themeStyle.textColor,
                        fontWeight: 'bold',
                        width: WIDTH,
                        fontFamily: appTextStyle.fontFamily,
                      }}>
                      {appConfigStyle.homeTitle}
                    </Text>
                  </View>
                )
              ) : (
                <Text
                  style={{
                    fontSize: appTextStyle.largeSize + 4,
                    color: appConfigStyle.headerColor
                      ? this.props.themeStyle.textTintColor
                      : this.props.themeStyle.textColor,
                    fontWeight: 'bold',
                    position: 'absolute',
                    width: WIDTH,
                    textAlign: 'center',
                    fontFamily: appTextStyle.fontFamily,
                  }}>
                  {name}
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Platform.OS === 'ios' ? -12 : -22,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.getLanguagesArray.length === 0) return;
                  const tempitem = this.props.getLanguagesArray.find(
                    data => data.code !== this.props.getSelectedlang.code,
                  );
                  this.updateLanguage(tempitem);
                }}>
                <Text
                  style={{
                    fontSize: appTextStyle.largeSize,
                    color: appConfigStyle.headerColor
                      ? this.props.themeStyle.textTintColor
                      : this.props.themeStyle.textColor,
                  }}>
                  {this.props.languageCode == 'AR' ? 'KD' : 'عربي'}
                </Text>
              </TouchableOpacity>
              {showGrid && (
                <TouchableOpacity
                  style={{paddingHorizontal: 14}}
                  onPress={() => {
                    this.props.setGridFlag(!this.props.gridFlag);
                  }}>
                  <Image
                    resizeMode="contain"
                    key={2}
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    source={require('../images/newImages/grid.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {routeName.startsWith('Home') && (
          <View
            style={[
              styles.headerView,
              {
                paddingTop: 5,
                paddingLeft: 20,
                paddingRight: 30,
                paddingBottom: 10,
                backgroundColor: appConfigStyle.headerColor
                  ? this.props.themeStyle.primary
                  : this.props.themeStyle.primaryBackgroundColor,
              },
            ]}>
            <View
              style={{
                width: '100%',
                height: 30,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SelectDropdown
                data={this.state.categories}
                defaultButtonText={'Categories'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.categoryDropdownBtnStyle}
                buttonTextStyle={styles.categoryDropdownBtnTxtStyle}
                dropdownStyle={styles.categoryDropdownStyle}
                rowStyle={styles.categoryDropdownRowStyle}
                rowTextStyle={styles.categoryDropdownRowTxtStyle}
              />
              {/* <Text
                style={{
                  color: 'white',
                  backgroundColor: 'black',
                  margin: 1,
                  fontSize: 9,
                  paddingHorizontal: 15,
                  paddingVertical: 4,
                }}>
                Categories
              </Text> */}
              <TouchableOpacity
                style={{
                  padding: 2,
                  backgroundColor: 'black',
                  margin: 1,
                }}
                onPress={() => {
                  this.props.navigation.navigate('SearchScreen');
                }}>
                <Icon
                  name={'search'}
                  style={{
                    color: appConfigStyle.headerColor
                      ? this.props.themeStyle.textTintColor
                      : this.props.themeStyle.textColor,
                    fontSize: 12,
                    margin: 3,
                    alignItems: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const getTheme = state => state.appConfig.themeStyle;
const getThemeFun = createSelector(
  [getTheme],
  getTheme => {
    return getTheme;
  },
);
const getLanguageCode = state => state.appConfig.languageCode;
const getLanguageCodeFun = createSelector(
  [getLanguageCode],
  getLanguageCode => {
    return getLanguageCode;
  },
);
const getLanguagesArray = state => state.languagesData.languages;

const getSelectedlangArray = state => state.languagesData.selectedlang;
const getLanguage = state => state.appConfig.languageJson;
/// ///////////////////////////////////////////////
const getSettings = state => state.settingsCall.settings;
const getSettingsFun = createSelector(
  [getSettings],
  getSettings => {
    return getSettings;
  },
);
const getSelectedlangArrayFun = createSelector(
  [getSelectedlangArray],
  getSelectedlangArray => {
    return getSelectedlangArray;
  },
);

const getLanguagesArrayFun = createSelector(
  [getLanguagesArray],
  getLanguagesArray => {
    return getLanguagesArray;
  },
);
const getGridFlag = state => state.appConfig.gridFlag;
const getGridFlagFun = createSelector(
  [getGridFlag],
  getGridFlag => {
    return getGridFlag;
  },
);

const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  languageCode: getLanguageCodeFun(state),
  getLanguagesArray: getLanguagesArrayFun(state),
  getSelectedlang: getSelectedlangArrayFun(state),
  settings: getSettingsFun(state),
  gridFlag: getGridFlagFun(state),
});
const getLanguageFun = createSelector(
  [getLanguage],
  getLanguage => {
    return getLanguage;
  },
);

const mapDispatchToProps = dispatch => ({
  clearLanguagesFun: value => {
    dispatch({
      type: CLEAR_LANGUAGES,
      value: value,
    });
  },
  setLanguageIdFun: value => {
    dispatch({
      type: SET_LANGUAGE_ID,
      value: value,
    });
  },
  setGridFlag: value => {
    dispatch({
      type: GRID_FLAG,
      value: value,
    });
  },
  getLanguageCall: th => {
    dispatch(async dispatch => {
      await getLanguages(dispatch, th);
    });
  },
  setLanguageCodeFun: value => {
    dispatch({
      type: LANG_CODE,
      value: value,
    });
  },
  getTranslationData: (data, t) => {
    dispatch(dispatch => {
      dispatch({
        type: SET_LANGUAGE,
        payload: data,
      });
      setTimeout(() => {
        t.setState({spinnerTemp: false}, () => {
          RNRestart.Restart();
        });
      }, 1000);
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'android' ? 28 : 20,
    width: WIDTH,
    paddingBottom: 4,
    marginBottom: 2,
  },
  iconStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0,
  },
  textinputStyle: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.8,
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0,
  },
  shadowStyle: {
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryDropdownStyle: {
    // width: '25%',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  categoryDropdownRowStyle: {
    width: '100%',
    height: 35,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  categoryDropdownRowTxtStyle: {},
  categoryDropdownBtnStyle: {
    width: 120,
    height: 26,
    color: 'white',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    left: 5,
  },
  categoryDropdownBtnTxtStyle: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 11,
  },
});
