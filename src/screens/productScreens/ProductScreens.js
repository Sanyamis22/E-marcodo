import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  StyleSheet,
  Linking,
  ScrollView,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {createSelector} from 'reselect';
import {
  getProducts,
  CLEAR_PRODUCTS,
  getOneProduct,
  colorFun,
  GRID_FLAG,
} from '../../redux/actions/actions';
import Toast from 'react-native-easy-toast';

import {UIActivityIndicator} from 'react-native-indicators';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../../common/HeaderCustom';
import {connect} from 'react-redux';
import CardTem from '../../common/CardTemplate';
import {CardItem, Icon} from 'native-base';
import Loader from 'react-native-easy-content-loader';
import Banner from '../../common/Banner';
import ImageLoad from '../../common/RnImagePlaceH';
import FlatListView from '../../common/FlatListView';
import CategoryFlatList from '../../common/CategoriesFlatList';
import theme, {appTextStyle} from '../../common/Theme.style';
import CategoryHeading from '../../common/CategoryHeading';
import ProductItem from '../../common/ProductItem';
import ProductDetailScreen from '../ProductDetailScreen';
import {getThumbnailImage} from '../../common/WooComFetch';
const WIDTH = Dimensions.get('window').width;
const Width2 = WIDTH;
class ProductScreens extends Component {
  static navigationOptions = () => ({
    headerShown: false,
  });

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isModalVisible: false,
      fabB: false,
      selected: '',
      timeValue: 400,
      selectedTab: '',
      productView: 'grid',
      loading: false,
      activityIndicatorTemp: true,
      spinnerTemp: false,
      //
      page: 1,
      productColorCounter: 0,
      subProductData: [],
      productDetailsData: [],
      currentCategoryTitle: '',
    };
    this.toast = null;
  }

  handleOpenURL = event => {
    // D
    if (event.url !== '' && event.url !== undefined && event.url !== null) {
      const route = event.url.replace(/.*?:\/\//g, '');
      const id = route.match(/\/([^/]+)\/?$/)[1];
      if (id !== '' && id !== undefined && id !== null) {
        this.setState({spinnerTemp: true}, () => {
          this.props.getOneProductsFun(this.props, this, id);
        });
      }
    }
  };

  navigate = json => {
    // E
    if (json !== '' && json !== undefined && json !== null) {
      Linking.removeEventListener('url', this.handleOpenURL);
      this.props.navigation.navigate('ProductDetails', {objectArray: json});
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({activityIndicatorTemp: false});
    }, 1000);
    this.props.navigation.setParams({
      headerTitle: this.props.language.Home,
    });
    if (Platform.OS === 'android') {
      const NativeLinking = require('react-native/Libraries/Linking/NativeLinking')
        .default;
      NativeLinking.getInitialURL().then(url => {
        if (url !== '' && url !== undefined && url !== null) {
          const route = url.replace(/.*?:\/\//g, '');
          const id = route.match(/\/([^/]+)\/?$/)[1];
          if (id !== '' && id !== undefined && id !== null) {
            this.setState({spinnerTemp: true}, () => {
              this.props.getOneProductsFun(this.props, this, id);
            });
          }
        }
      });
    } else {
      this.dimensionsSubscription = Linking.addEventListener(
        'url',
        this.handleOpenURL,
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.activityIndicatorTemp);
    if (this.dimensionsSubscription !== undefined) {
      this.dimensionsSubscription.remove();
    }
  }

  renderItem = (item, index) => (
    <View>
      <Loader
        secondaryColor="rgba(208, 205, 205, 1)"
        primaryColor="rgba(218, 215, 215, 1)"
        animationDuration={this.state.timeValue}
        active
        loading={this.state.loading}
        containerStyles={[
          styles.loaderContainer,
          {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            width: WIDTH * theme.twoRowCardWIdth,
          },
        ]}
        pRows={3}
        pWidth={['100%', '100%', '80%']}
        pHeight={30}
        titleStyles={[
          styles.titleStyle,
          {
            width: WIDTH * theme.twoRowCardWIdth,
          },
        ]}
        paragraphStyles={styles.paragraphStyles}>
        <CardTem
          backgroundColor={colorFun(this, item.index)}
          objectArray={item.item}
          rows={this.props.vertical}
          recent={this.state.recent}
          width={WIDTH * theme.twoRowCardWIdth}
        />
      </Loader>
    </View>
  );
  // )

  renderSeparator = () => <View style={styles.separatorStyle} />;

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

  handleLoadMore() {
    if (this.props.products.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.props.products.length > 9,
        },
        () => {
          this.state.page++;
          this.props.getProductsFun(this.props, this.state.page, this);
        },
      );
    } else {
      this.setState({
        refreshing: false,
      });
    }
  }

  _handleSubProduct(item) {
    const newData = this.props.products.filter(data => {
      if (item == data.product_brand.brand_id) {
        return data;
      } else {
        this.noProductFun();
      }
    });
    this.setState({
      subProductData: newData,
      currentCategoryTitle: newData.parent_name,
    });
  }
  _handleProductDetails(item) {
    console.log('ProductID==>', item);
    const newProductData = this.props.products.filter(data => {
      if (item == data.product_id) {
        return data;
      } else {
        this.noProductFun();
      }
    });
    this.setState({
      productDetailsData: newProductData,
      isModalVisible: true,
    });
  }

  renderFooter = () => (
    <View
      style={[
        styles.footerStyle,
        {
          marginBottom: this.state.refreshing ? 50 : 10,
        },
      ]}>
      {this.state.refreshing ? (
        <View
          style={{
            height: 10,
            marginTop: 25,
          }}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={this.props.themeStyle.primary}
          />
        </View>
      ) : null}
    </View>
  );

  onEndReached = () => {
    this.handleLoadMore();
    this.onEndReachedCalledDuringMomentum = true;
    // }
  };

  handleScroll(event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({fabB: false});
    }
  }

  // categoryHeading (text) {
  //   return (
  //     <Text
  //       style={[styles.categoryTypeStyle, {
  //         fontFamily: appTextStyle.fontFamily,
  //         fontSize: appTextStyle.largeSize + 3,
  //         color: this.props.themeStyle.textColor
  //       }]}>
  //       {text}
  //     </Text>

  //   )
  // }

  iconTextFun = (iconName, text) => (
    <View style={styles.iconTextStyle}>
      <FontAwesome
        name={iconName}
        style={{
          color: this.props.themeStyle.iconPrimaryColor,
          transform: [{rotateY: '180deg'}],
          fontSize:
            appTextStyle.largeSize + PixelRatio.getPixelSizeForLayoutSize(6),
        }}
      />
      <Text
        style={{
          fontSize: appTextStyle.smallSize - 1,
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily,
          paddingTop: 5,
        }}>
        {text}
      </Text>
    </View>
  );

  render() {
    if (this.props.products.length > 0) {
      this.state.loading = false;
      this.state.timeValue = 400;
      if (this.props.products.length % 10 === 0) {
        this.state.refreshing = true;
      } else {
        this.state.refreshing = false;
      }
    } else {
      this.state.loading = true;
      this.state.timeValue = 400;
      this.state.refreshing = false;
    }

    return this.state.activityIndicatorTemp ? (
      <View
        style={[
          styles.activityIndicatorContainer,
          {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          },
        ]}>
        <UIActivityIndicator size={27} color={this.props.themeStyle.primary} />
      </View>
    ) : (
      // return
      <View
        style={{
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
        }}>
        <Spinner visible={this.state.spinnerTemp} />
        <Header
          searchIcon={true}
          menuIcon={true}
          cartIcon={true}
          navigation={this.props.navigation}
          name={this.props.settings.app_name}
        />
        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={{backgroundColor: this.props.themeStyle.iconPrimaryColor}}
          position="top"
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{
            color: this.props.themeStyle.textColor,
            fontSize: appTextStyle.largeSize,
          }}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          windowSize={50}
          initialNumToRender={6}
          removeClippedSubviews={true}
          legacyImplementation={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={10}
          data={
            this.props.products !== undefined &&
            this.props.products !== null &&
            this.props.products.length > 0
              ? this.props.products
              : ['', '', '', '']
          }
          key={this.state.productView}
          numColumns={2}
          ref={ref => {
            this.flatListRef = ref;
          }}
          ListFooterComponent={() => this.renderFooter()}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{
            paddingLeft: WIDTH * 0.01,
          }}
          contentContainerStyle={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          }}
          extraData={this.state}
          ListHeaderComponent={
            <View style={styles.headerListStyle}>
              <View
                style={{
                  backgroundColor: this.props.themeStyle
                    .secondryBackgroundColor,
                  paddingTop: 20,
                }}>
                <CategoryHeading key={0} text="Home / Product 0" />
                {/* <ScrollView key={1} horizontal={true} style={{marginTop: 20}}>
                  {Array(10)
                    .fill(0)
                    .map((item, index) => {
                      return (
                        <View
                          key={index + 100}
                          style={{paddingBottom: 10, paddingLeft: 10}}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                alignItems: 'center',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: index === 0 ? 'orange' : 'black',
                              }}>
                              sub{index}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </ScrollView> */}
                <ScrollView key={2} horizontal={true}>
                  {this.props.products
                    .reduce((acc, curr) => {
                      if (
                        acc?.findIndex(
                          item =>
                            item.product_brand.brand_id ==
                            curr.product_brand.brand_id,
                        ) == -1
                      ) {
                        acc.push(curr);
                      }
                      return acc;
                    }, [])
                    .map((item, index) => {
                      console.log('===>>sortCategory', item);
                      return (
                        <View
                          key={index + 100}
                          style={{paddingBottom: 10, paddingLeft: 5}}>
                          <TouchableOpacity
                            onPress={() =>
                              this._handleSubProduct(
                                item.product_brand.brand_id,
                              )
                            }>
                            <View
                              style={{
                                width: 80,
                                height: 80,
                                justifyContent: 'center',
                                borderWidth: 1,
                                margin: 5,
                              }}>
                              {/* <Text
                              style={{
                                alignItems: 'center',
                                textAlign: 'center',
                              }}>
                              {item.name}
                            </Text> */}
                              <Image
                                style={styles.imageStyle}
                                placeholder={false}
                                backgroundColor="transparent"
                                color="transparent"
                                source={{
                                  uri:
                                    getThumbnailImage() +
                                    item.product_brand.gallary.name,
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                          <Text
                            style={{alignItems: 'center', textAlign: 'center'}}>
                            {item.product_brand.brand_name}
                          </Text>
                        </View>
                      );
                    })}
                </ScrollView>

                <View
                  key={6}
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 3,
                    borderWidth: 0.1,
                  }}>
                  <View
                    key={0}
                    style={{
                      flexDirection: 'row',
                      width: 80,
                      height: 40,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Filter
                    </Text>
                  </View>
                  <View
                    key={1}
                    style={{
                      width: 80,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Sort
                    </Text>
                  </View>
                  <View
                    key={2}
                    style={{
                      flexDirection: 'row',
                      width: 80,
                      height: 40,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
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
                        source={require('../../images/newImages/grid.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  key={7}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <Text key={0} style={{color: 'black'}}>
                    {this.state.currentCategoryTitle}
                  </Text>
                </View>
                <ScrollView key={8} style={{paddingHorizontal: 10}}>
                  {this.state.subProductData?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index + 300}
                        style={{paddingBottom: 5, paddingLeft: 5}}
                        onLongPress={() =>
                          this._handleProductDetails(item.product_id)
                        }>
                        <ProductItem
                          navigation={this.props.navigation}
                          header={{
                            rate: 50,
                            option1: 'Best Seller',
                            option2: 'New Arrival',
                          }}
                          imgLink={{
                            uri:
                              getThumbnailImage() +
                              item.product_gallary.gallary_name,
                          }}
                          title={item.detail[0].title}
                          priceOld={item.product_price}
                          priceCurrent={item.product_discount_price}
                          favorite={false}
                          grid={false}
                          smallImageList={[
                            {
                              uri:
                                getThumbnailImage() +
                                item.product_gallary_detail[0].gallary_name,
                            },
                            {
                              uri:
                                getThumbnailImage() +
                                item.product_gallary_detail[0].gallary_name,
                            },
                          ]}
                          time={{days: 17, hrs: 17, mins: 17, seconds: 17}}
                          onAddCart={() => this.handleAddCart()}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          }
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
        />
        <Modal
          visible={this.state.isModalVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({isModalVisible: false});
          }}
          animationType={'fade'}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isModalVisible: false})
              }>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            {console.log('MODAL==>>', this.state.productDetailsData)}
            <View
              style={[
                {
                  backgroundColor: this.props.themeStyle
                    .secondryBackgroundColor,
                  paddingHorizontal: 10,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                },
              ]}>
              <View
                style={[
                  styles.closeIconView,
                  {
                    backgroundColor: this.props.themeStyle.iconPrimaryColor,
                  },
                ]}
              />
            </View>
            <View style={styles.modalDetailContainer}>
              <ProductDetailScreen productData={this.state.productDetailsData} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

// //////////////////////
const mapDispatchToProps = dispatch => ({
  getOneProductsFun: (props, th, id) => {
    dispatch(async dispatch => {
      await getOneProduct(
        dispatch,
        props.settings.language_id,
        props.settings.currency_id,
        id,
        th,
      );
    });
  },
  getProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getProducts(
        dispatch,
        props.settings.language_id,
        props.settings.currency_id,
        page,
        th,
      );
    });
  },
  setGridFlag: value => {
    dispatch({
      type: GRID_FLAG,
      value: value,
    });
  },
  clearProducts: () => {
    dispatch({
      type: CLEAR_PRODUCTS,
    });
  },
});
/// ///////////////////////////////////////////////
const getTheme = state => state.appConfig.themeStyle;
const getLanguage = state => state.appConfig.languageJson;
const getGridFlag = state => state.appConfig.gridFlag;
const getAppinPro = state => state.appConfig.appInProduction;

const getCategories = state => state.getCategories.sortCategory;
const getBanners = state => state.bannersData.banners;
const getSettings = state => state.settingsCall.settings;
const getproductsArray = state => state.productsData.products;
const getHotProductsArray = state => state.productsData.hotProducts;
const gettopsellerProductsArray = state => state.productsData.topsellerProducts;

const gettopsellerProductsArrayFun = createSelector(
  [gettopsellerProductsArray],
  gettopsellerProductsArray => {
    return gettopsellerProductsArray;
  },
);

const getAppinProFun = createSelector(
  [getAppinPro],
  getAppinPro => {
    return getAppinPro;
  },
);

const getproductsArrayFun = createSelector(
  [getproductsArray],
  getproductsArray => {
    return getproductsArray;
  },
);

const getHotProductsArrayFun = createSelector(
  [getHotProductsArray],
  getHotProductsArray => {
    return getHotProductsArray;
  },
);

const getBannersFun = createSelector(
  [getBanners],
  getBanners => {
    return getBanners;
  },
);

const getCategoriesFun = createSelector(
  [getCategories],
  getCategories => {
    return getCategories;
  },
);

const getThemeFun = createSelector(
  [getTheme],
  getTheme => {
    return getTheme;
  },
);

const getLanguageFun = createSelector(
  [getLanguage],
  getLanguage => {
    return getLanguage;
  },
);

const getGridFlagFun = createSelector(
  [getGridFlag],
  getGridFlag => {
    return getGridFlag;
  },
);

const getSettingsFun = createSelector(
  [getSettings],
  getSettings => {
    return getSettings;
  },
);

const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  sortCategory: getCategoriesFun(state),
  banners: getBannersFun(state),
  settings: getSettingsFun(state),
  products: getproductsArrayFun(state),
  appInProduction: getAppinProFun(state),
  hotProducts: getHotProductsArrayFun(state),
  topsellerProducts: gettopsellerProductsArrayFun(state),
  gridFlag: getGridFlagFun(state),
});

/// //////////////////////////////////////////
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductScreens);
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  loaderContainer: {
    height: Platform.OS === 'android' ? 260 : 230,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#000',
    shadowOpacity: 0.5,
    elevation: 3,
    margin: 5,
  },
  modalDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
    paddingHorizontal: 0,
    margin: 20,
  },
  titleStyle: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
    height: 130,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  paragraphStyles: {
    paddingTop: 7,
    padding: 6,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  separatorStyle: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
  },
  footerStyle: {
    marginTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  categoryTypeStyle: {
    padding: 110,
    alignSelf: 'center',
  },
  iconTextStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    alignSelf: 'center',
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoPanalContainer: {
    zIndex: 5,
    position: 'absolute',
    left: 20,
    bottom: 90,
    alignItems: 'center',
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  demoPanal: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22,
  },
  fabStyle: {
    zIndex: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 25,
    marginBottom: 60,
  },
  fabView: {
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 400,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22,
  },
  headerListStyle: {
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  singleBanner: {
    width: WIDTH,
    height: 160,
    marginTop: 0,
    marginBottom: 5,
  },
  noProductView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
    alignSelf: 'center',
  },
  imageStyle: {
    height: Width2 * 0.2,
    width: Width2 * 0.2,
    overflow: 'hidden',
  },
});
