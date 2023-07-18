import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Icon} from 'native-base';
import {UIActivityIndicator} from 'react-native-indicators';
import {CardStyleInterpolators} from 'react-navigation-stack';
import CategoryFlatList from '../common/CategoriesFlatList';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Header from '../common/HeaderCustom';
import {appTextStyle} from '../common/Theme.style';
import downIcon from '../images/down_dark.png';
import nextIcon from '../images/next_dark.png';
import {getThumbnailImage} from '../common/WooComFetch';

class Category3 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activityIndicatorTemp: false,
      activeId: 0,
      isVisible: false,
      subCategoryData: [],
      categories: [
        {
          id: 1,
          title: 'Home Supply',
          imgLink: require('../images/IntroImages/slide2.jpg'),
          active: false,
        },
        {
          id: 2,
          title: 'Kitchenware &\n Tableware',
          imgLink: require('../images/IntroImages/slide3.jpg'),
          active: false,
        },
        {
          id: 3,
          title: 'Electronic',
          imgLink: require('../images/IntroImages/slide2.jpg'),
          active: false,
        },
        {
          id: 4,
          title: 'Grocery',
          imgLink: require('../images/IntroImages/slide3.jpg'),
          active: false,
        },
      ],
    };
  }

  noProductFun = () => (
    <View style={styles.noProductView}>
      <Icon name={'logo-dropbox'} style={{color: 'gray', fontSize: 80}} />
      <Text
        style={{
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 2,
          color: this.props.themeStyle.textColor,
        }}>
        {this.props.language['No Products Found']}
      </Text>
    </View>
  );

  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Category,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor,
    });
    this.setState({activityIndicatorTemp: false});
  }

  setActiveItem(item) {
    console.log('Item is active', item);
    // let id = value;
    // if (value === this.state.activeId) {
    //   id = 0;
    // }
    // this.setState(state => ({
    //   ...state,
    //   activeId: id,
    // }));
    // const newData = this.props.sortCategory.filter(data => {
    //   if (item == data.parent) {
    //     return data;
    //   } else {
    //     this.noProductFun();
    //   }
    // });
    const newData = this.props.sortCategory
      .filter(data => {
        if (data.parent == item) {
          return data;
        } else {
          this.noProductFun();
        }
      })
      .reduce((acc, curr) => {
        if (acc?.findIndex(item => item.name == curr.name) == -1) {
          acc.push(curr);
        }
        return acc;
      }, []);
    if (!this.state.isVisible) {
      this.setState({isVisible: true});
      this.setState({
        subCategoryData: newData,
        activeId: item,
      });
    } else {
      this.setState({isVisible: false});
    }
  }

  render() {
    // old code
    // return this.state.activityIndicatorTemp ? (
    //   <View
    //     style={styles.indicatorView}>
    //     <UIActivityIndicator
    //       size={27}
    //       color={this.props.themeStyle.primary}
    //     />
    //   </View>
    // ) : (
    //   <View style={{
    //     flex: 1,
    //     backgroundColor: this.props.themeStyle.secondryBackgroundColor
    //   }}>
    //     <Header backIcon={this.props.navigation.dangerouslyGetParent().state.index >= 0} menuIcon={!(this.props.navigation.dangerouslyGetParent().state.index >= 1)} cartIcon={true} navigation={this.props.navigation} name={this.props.language.Category} />
    //     {this.props.sortCategory.length === 0 ? (
    //       <View
    //         style={styles.emptyProductView}>
    //         <View
    //           style={styles.emptyProductInnerView}>
    //           <Icon
    //             name={'logo-dropbox'}
    //             style={{ color: 'gray', fontSize: 80 }}
    //           />

    //           <Text style={{
    //             fontSize: appTextStyle.largeSize + 2,
    //             fontFamily: appTextStyle.fontFamily,
    //             color: this.props.themeStyle.textColor
    //           }}>
    //             {this.props.language['No Products Found']}
    //           </Text>
    //         </View>
    //       </View>
    //     ) : (
    //       <CategoryFlatList
    //         dataSource={this.props.sortCategory}
    //         products={this.props.language.Products}
    //         allCategories={this.props.sortCategory}
    //         props={this.props}
    //         noOfCol={2}
    //         categoryPage={3}
    //         separator={false}
    //       />
    //     )}
    //   </View>
    // )
    return (
      <View style={styles.flexColumn}>
        <Header
          searchIcon={true}
          menuIcon={true}
          cartIcon={true}
          navigation={this.props.navigation}
        />
        <ScrollView style={styles.container}>
          <Image
            source={require('../images/newImages/mrcado.jpg')}
            style={styles.headerImg}
          />
          <Text style={styles.accountTxt}>Account</Text>
          <Text style={styles.signTxt}>
            Login/Sign in for the best experience
          </Text>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginTxt}>Log in</Text>
          </TouchableOpacity>
          <ScrollView style={styles.cateContainer}>
            {this.props.sortCategory
              .reduce((acc, curr) => {
                if (
                  acc?.findIndex(
                    item => item.parent_name == curr.parent_name,
                  ) == -1
                ) {
                  acc.push(curr);
                }
                return acc;
              }, [])
              .map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={[
                      styles.flexRow,
                      styles.cateItem,
                      styles.borderShadow,
                    ]}
                    onPress={() => this.setActiveItem(item.parent)}>
                    <View style={styles.flexRow}>
                      <Image
                        source={{
                          uri: getThumbnailImage() + item.gallary,
                        }}
                        style={styles.cateImg}
                      />
                      <Text style={styles.styleTxt}>{item.parent_name}</Text>
                    </View>
                    <Image
                      source={
                        this.state.activeId === item.parent &&
                        this.state.isVisible
                          ? nextIcon
                          : downIcon
                      }
                      style={{tintColor: '#fdb515'}}
                    />
                  </TouchableOpacity>
                  {this.state.activeId === item.parent && this.state.isVisible && (
                    <View style={styles.subContainer}>
                      {this.state.subCategoryData?.map((subItem, subIndex) => (
                        <TouchableOpacity
                          key={subIndex}
                          style={[
                            styles.flexRow,
                            styles.subItem,
                            styles.borderShadow,
                          ]}
                          onPress={() => {
                            this.props.navigation.navigate('CategoryScreens', {
                              slagName: item.parent_name,
                              slagId: item.parent,
                            });
                          }}>
                          <View style={styles.flexRow}>
                            <Image
                              source={{
                                uri: getThumbnailImage() + subItem.gallary,
                              }}
                              style={styles.subImg}
                            />
                            <Text style={styles.styleTxt}>{subItem.name}</Text>
                          </View>
                          <Image
                            source={downIcon}
                            style={{tintColor: '#fdb515'}}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}
/// ///////////////////////////////////////////////
/// ///////////////////////////////////////////////
const getTheme = state => state.appConfig.themeStyle;
const getLanguage = state => state.appConfig.languageJson;
const getCategories = state => state.getCategories.sortCategory;
const getThemeFun = createSelector(
  [getTheme],
  getTheme => {
    return getTheme;
  },
);
const getCategoriesFun = createSelector(
  [getCategories],
  getCategories => {
    return getCategories;
  },
);
const getLanguageFun = createSelector(
  [getLanguage],
  getLanguage => {
    return getLanguage;
  },
);
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  sortCategory: getCategoriesFun(state),
});
/// //////////////////////////////////////////
export default connect(
  mapStateToProps,
  null,
)(Category3);
const styles = StyleSheet.create({
  indicatorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyProductView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  emptyProductInnerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  borderShadow: {
    elevation: 5,
    shadowColor: '#171717',
  },
  styleTxt: {
    fontWeight: '700',
    color: 'black',
    fontSize: 22,
  },

  container: {
    padding: 10,
    marginBottom: 60,
  },

  loginBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcc922',
    height: 60,
  },
  loginTxt: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },

  cateContainer: {},
  cateItem: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 100,
  },
  cateImg: {
    width: 100,
    height: 70,
    marginRight: 20,
  },
  headerImg: {
    width: 380,
    height: 200,
    marginBottom: 25,
  },
  subContainer: {},
  subItem: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightgray',
    height: 80,
  },
  subImg: {
    width: 80,
    height: 60,
    marginRight: 20,
  },
  accountTxt: {
    color: 'black',
    fontSize: 13,
    fontWeight: '700',
  },
  signTxt: {
    color: 'black',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 5,
  },
});
