import React, { Component } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  UIManager,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  FlatList,
  I18nManager,
  SafeAreaView,
  Modal,
  Switch
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'
import ImageLoad from '../common/RnImagePlaceH'
import { ListItem, Icon } from 'native-base'
import { appTextStyle } from '../common/Theme.style.js'
import ExpandableListView from './ExpandableListView'
import { connect } from 'react-redux'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import {
  LoginManager,
  AccessToken,
  GraphRequestManager,
  GraphRequest
} from 'react-native-fbsdk'
import LanguageScreen from '../screens/LanguageScreen'
const pageNumbers = [1]
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const DrawerWidth2 = WIDTH * 0.78

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
)
class App extends Component {
  constructor(props) {
    super(props)

    this.state = { AccordionData: [], orientation: '', expend: true, isModalVisible: false, isModalVisible1: false }

  }

  signOut = async () => {
    try {
      await GoogleSignin.signOut()
      await GoogleSignin.revokeAccess()
    } catch (error) {
      console.log(error)
    }
  };

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ orientation: 'portrait' })
    } else {
      this.setState({ orientation: 'landscape' })
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    let array = []
    array = [
      {
        expanded: false,
        categoryName: {
          id: 3,
          name: 'SHOP',
          iconName: 'cart',
          jsonName: this.props.language.Shop,
          subCategory: [
            {
              id: 7,
              jsonName: this.props.language.Newest,
              name: 'NEWEST',
              iconName: 'open'
            },
            {
              id: 8,
              jsonName: this.props.language.Deals,
              name: 'DEALS',
              iconName: 'shirt'
            }, // open arrow-dropup-circle
            {
              id: 9,
              jsonName: this.props.language[
                'Top Seller'
              ],
              name: 'TOPSELLER',
              iconName: 'star'
            }, // open arrow-dropup-circle
            {
              id: 10,
              jsonName: this.props.language[
                'Most Liked'
              ],
              name: 'MOSTLIKED',
              iconName: 'star'
            }
          ]
        }
      }
    ]
    this.getOrientation()
    this.dimensionsSubscription = Dimensions.addEventListener('change', this.getOrientation)

  }
  componentWillUnmount() {
    this.orientation = null
    this.AccordionData = null
    // this.dimensionsSubscription.remove()
  }

  updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const array = [...this.state.AccordionData]
    array[index].expanded = !array[index].expanded

    this.setState(() => ({
      AccordionData: array,
      expend: false
    }))
  }

  setExpened = (value) => {
    this.setState({ expend: value })
  }

  navCatFun = item => {
    const string = item
    const newString = string.replace(/\s+/g, '') // "thiscontainsspaces"
    if (
      newString === 'Sale' ||
      newString === 'Deals' ||
      newString === 'Top Seller' ||
      newString === 'Most Liked'
    ) {
      this.props.navigation.navigate('NewestScreen', {
        id: '',
        name: '', /// ////////////////////////////////////////////////
        sortOrder: newString
      })
    } else {
    }
  }

  categoryFun1 (text, iconName, nav, font, borderWidth) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 0,
            paddingBottom: 0,
            paddingTop: 0,
            width: WIDTH * 0.94,
            alignSelf: 'center'
          }}>
          {nav === 'rate1' ? (
            <RateUsButton
              text={text}
              iconName={iconName}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onPress={() => {
                text ===
                  this.props.isLoading.appConfig.languageJson['Official Website']
                  ? Linking.openURL(nav)
                  : text !==
                    this.props.isLoading.appConfig.languageJson[
                      'Dark Mode'
                    ] &&
                    text !==
                    this.props.isLoading.appConfig.languageJson[
                      'Light Mode'
                    ] ? this.setState({
                      isModalVisible: false
                    }, () => {
                      this.props.navigation.navigate(nav)
                    }) : null
              }}>
              <View style={styles.tabComponents}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{
                    fontSize: appTextStyle.mediumSize + 1,
                    fontFamily: appTextStyle.fontFamily,
                    color: this.props.themeStyle.textColor
                  }}>{text}</Text>
                </View>

                {text ===
                  this.props.isLoading.appConfig.languageJson[
                    'Dark Mode'
                  ] ? (
                    <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                      <Switch
                        thumbColor={this.props.themeStyle.primary}
                        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                        onValueChange={() => this.toggleSwitch1(false)}
                        value={this.state.switch1Value}
                      />
                    </View>
                  ) : text ===
                  this.props.isLoading.appConfig.languageJson[
                    'Light Mode'
                  ] ? (
                      <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                        <Switch
                          thumbColor={this.props.themeStyle.primary}
                          style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                          onValueChange={() => this.toggleSwitch1(true)}
                          value={this.state.switch2Value}
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
                        style={{
                          color: this.props.themeStyle.iconPrimaryColor,
                          fontSize: appTextStyle.largeSize
                        }}
                      />
                    )}
              </View>
            </TouchableOpacity>
          )}
        </View>
        {!borderWidth
          ? <View
            style={{
              width: WIDTH * 0.9299,
              height: 1,
              backgroundColor: this.props.themeStyle.primary
            }}
          /> : null}
      </View>
    )
  }
  categoryFun(text, iconName, tempNo, imageTemp, globalText) {
    return (
      <ListItem noIndent={true}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            tempNo === 0
              ? this.navCatFun.bind(this, text)
              : this.navCatFun.bind(this, `${text} ${tempNo}`)
          }>
          <View
            style={{
              width: WIDTH * 0.4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
            <ImageLoad
              key={0}
              style={{
                width: 22,
                height: 22,
                marginRight: I18nManager.isRTL ? 8 : 4,
                marginLeft: 0
              }}
              loadingStyle={{ size: 'large', color: this.props.themeStyle.primary }}
              placeholder={false}
              ActivityIndicator={true}
              placeholderStyle={{ width: 0, height: 0 }}
              source={imageTemp}
            />
            <Text style={{
              textAlign: 'left',
              color: this.props.themeStyle.textColor,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily,
              fontWeight: '500',
              marginLeft: I18nManager.isRTL ? (Platform.OS === 'ios' ? 0 : 7) : 9
            }}>{globalText}</Text>
          </View>
        </TouchableOpacity>
      </ListItem>
    )
  }

  static getDerivedStateFromProps(props, state) {
    return {
      AccordionData: props.sortCategory
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }}>

        <View style={[styles.headerView, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor
        }]}>
          <Text style={[styles.headingText, {
            color: this.props.themeStyle.textColor,
            fontSize: appTextStyle.largeSize + 2,
            fontFamily: appTextStyle.fontFamily
          }]}>
            {Object.keys(this.props.userData).length !== 0
              ? this.props.language.Hello + ' ' +
              this.props.userData.first_name + '!'
              : this.props.language.Hello + ' ' + this.props.language.Guest}
          </Text>
        </View>
        <View
          style={{
            marginTop: 0
          }}>
          <FlatList
            data={pageNumbers}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}
            keyExtractor={pageNumber => pageNumber.toString()}
            extraData={this.state}
            renderItem={() => (
              <View>
                {this.state.AccordionData.map((item, key) => (
                  <ExpandableListView
                    key={key}
                    categories={this.props.categories}
                    onClickFunction={this.updateLayout.bind(this, key)}
                    item={item}
                    navigation={this.props.navigation}
                    count={key}
                    setExpened={this.setExpened}
                    expend={this.state.expend}
                  />
                ))}
                {/* ////////////////////////////////////////// */}

              </View>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isModalVisible: true })
          }}>
          <View style={{ flexDirection: 'row', height: 50, paddingLeft: 20 }}>
            <Icon
              name={'md-settings'}
              style={[styles.demoPanal, {
                color: this.props.themeStyle.primary,
                alignSelf: 'center'
              }]}
            />
            <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>{this.props.language.Settings}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isModalVisible1: true })
          }}>
          <View style={{ flexDirection: 'row', height: 50, paddingLeft: 20 }}>
            <Icon
              type="FontAwesome"
              name="globe"
              style={[styles.demoPanal, {
                color: this.props.themeStyle.primary,
                alignSelf: 'center'
              }]}
            />
            <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>{this.props.language.Language}</Text>
          </View>
        </TouchableOpacity>
        {/* {this.props.userData !== undefined
          ? Object.keys(this.props.userData).length !== 0
            ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.logOutCall(this)
                  let currentAccessToken = ''
                  AccessToken.getCurrentAccessToken()
                    .then(data => {
                      currentAccessToken = data.accessToken.toString()
                    })
                    .then(() => {
                      const logout = new GraphRequest(
                        'me/permissions/',
                        {
                          accessToken: currentAccessToken,
                          httpMethod: 'DELETE'
                        },
                        error => {
                          if (error) {
                          } else {
                            LoginManager.logOut()
                          }
                        }
                      )
                      new GraphRequestManager().addRequest(logout).start()
                    })
                    .catch(() => {
                    })
                  this.signOut()
                }}>
                <View style={{ flexDirection: 'row', height: 50, paddingLeft: 20 }}>
                  <Icon
                    type="Feather"
                    name="log-out"
                    style={[styles.demoPanal, {
                      color: this.props.themeStyle.primary,
                      alignSelf: 'center'
                    }]}
                  />
                  <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>Log out</Text>
                </View>
              </TouchableOpacity>
            ) : null : null } */}
        <Modal onRequestClose={() => {
          this.setState({
            isModalVisible: false
          })
        }} visible={this.state.isModalVisible} animationType={'fade'}>

          <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: WIDTH
            }}>

              <TouchableOpacity style={{
                zIndex: 12
              }} onPress={() => this.setState({
                isModalVisible: false
              })}>
                <Ionicons
                  name={'close'}
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontSize: appTextStyle.largeSize + 6,
                    padding: 15
                  }}
                />
              </TouchableOpacity>
              <Text style={{
                fontSize: appTextStyle.largeSize + 2,
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor,
                alignSelf: 'center',
                position: 'absolute',
                width: WIDTH,
                textAlign: 'center',
                fontWeight: 'bold'

              }}>
                {
                  this.props.isLoading.appConfig.languageJson.Settings
                }
              </Text>
            </View>

            <View style={{
              borderRadius: appTextStyle.customRadius,
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              width: WIDTH * 0.93,
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: this.props.themeStyle.primary
            }}>

              {this.categoryFun1(!this.props.isDarkMode
                ? this.props.isLoading.appConfig.languageJson[
                'Dark Mode'
                ] : this.props.isLoading.appConfig.languageJson[
                'Light Mode'
                ],
                'globe',
                'LanguageScreen'
              )}

              {/* {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Select Language'],
                  'globe',
                  'LanguageScreen'
                )} */}
              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['Select Currency'],
                'logo-usd',
                'CurrencyScreen'
              )}
              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['About Us'],
                'md-albums',
                'AboutScreen'
              )}
              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['Privacy Policy'],
                'cart',
                'PrivacyPolicyScreen'
              )
              }
              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['Term and Services'],
                'md-call',
                'TermAndServiceScreen'
              )}

              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['Refund Policy'],
                'md-albums',
                'RefundPolicy'
              )}

              {this.categoryFun1(
                this.props.isLoading.appConfig.languageJson['Contact Us'],
                'md-call',
                'ContactUsScreen',
                false,
                true
              )}
            </View>

            {this.props.userData !== undefined

              ? Object.keys(this.props.userData).length !== 0
                ? (
                  <TouchableOpacity
                    style={{
                      paddingTop: 25,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: appTextStyle.customRadius
                    }}
                    onPress={() => {
                      this.setState({
                        isModalVisible: false
                      }, () => {
                        this.props.logOutCall(this)
                        let currentAccessToken = ''
                        AccessToken.getCurrentAccessToken()
                          .then(data => {
                            currentAccessToken = data.accessToken.toString()
                          })
                          .then(() => {
                            const logout = new GraphRequest(
                              'me/permissions/',
                              {
                                accessToken: currentAccessToken,
                                httpMethod: 'DELETE'
                              },
                              error => {
                                if (error) {
                                } else {
                                  LoginManager.logOut()
                                }
                              }
                            )
                            new GraphRequestManager().addRequest(logout).start()
                          })
                          .catch(() => {
                          })
                        this.signOut()
                      })
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        width: WIDTH * 0.93,
                        backgroundColor: this.props.themeStyle.primary,
                        justifyContent: 'center',
                        borderRadius: appTextStyle.customRadius

                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: appTextStyle.fontFamily,
                          fontSize: appTextStyle.largeSize,
                          color: this.props.themeStyle.textTintColor,
                          padding: 10
                        }}>
                        {this.props.isLoading.appConfig.languageJson['Log Out']}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null : null}
          </SafeAreaView>
        </Modal>
        <Modal onRequestClose={() => {
          this.setState({
            isModalVisible1: false
          })
        }} visible={this.state.isModalVisible1} animationType={'fade'}>

          <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: WIDTH
            }}>

              <TouchableOpacity style={{
                zIndex: 12
              }} onPress={() => this.setState({
                isModalVisible1: false
              })}>
                <Ionicons
                  name={'close'}
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontSize: appTextStyle.largeSize + 6,
                    padding: 15
                  }}
                />
              </TouchableOpacity>
              <Text style={{
                fontSize: appTextStyle.largeSize + 2,
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor,
                alignSelf: 'center',
                position: 'absolute',
                width: WIDTH,
                textAlign: 'center',
                fontWeight: 'bold'

              }}>
                {
                  this.props.isLoading.appConfig.languageJson.Language
                }
              </Text>
            </View>

            <View style={{
              borderRadius: appTextStyle.customRadius,
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              flex: 1
            }}>

              <LanguageScreen/>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : 0
const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
const getCategories = (state) => state.getCategories.categories
const getSortCategory = (state) => state.getCategories.sortCategory
const getUserData = (state) => state.userData.user

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getSortCategoryFun = createSelector(
  [getSortCategory],
  (getSortCategory) => {
    return getSortCategory
  }
)
const getCategoriesFun = createSelector(
  [getCategories],
  (getCategories) => {
    return getCategories
  }
)
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  categories: getCategoriesFun(state),
  sortCategory: getSortCategoryFun(state),
  userData: getUserDataFun(state),
  isLoading: state,
  setModeValue: (id) => dispatch(setModeValue(id))
  // isLoading
})

const mapDispatchToProps = dispatch => ({
  logOutCall: (th) => {
    dispatch(async dispatch => {
      await logOut(dispatch, th)
    })
  },
  setModeValue: (id) => dispatch(setModeValue(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  modalContainer: {
    flex: 1
  },
  tabComponents: {
    flexDirection: 'row',
    alignContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  },
  headingText: {
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'left'
  },
  textImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'ios' ? 103 : 97,

    width: DrawerWidth2,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  headerView: {
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 3,
    marginBottom: 5,
    paddingLeft: 10
  },
  headerText: {
    textAlign:
      Platform.OS === 'ios' ? 'left' : I18nManager.isRTL ? 'right' : 'left',
    fontSize: 21,
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 8 : 10,
    alignSelf: 'center'
  },
  headerIcon: {
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    fontSize: 23
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5
  },
  demoPanal: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22
  },
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  }
})
