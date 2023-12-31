import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class ProductItem extends Component {
  render(
    {
      navigation,
      header,
      imgLink,
      title,
      priceOld,
      priceCurrent,
      favorite,
      grid,
      smallImageList,
      time,
      headerShown,
      homeView,
      onProductClick,
    } = this.props,
  ) {
    return (
      <TouchableOpacity
        style={grid ? styles.container : styles.container1}
        onPress={onProductClick}>
        <View style={grid ? {} : {width: '50%'}}>
          {headerShown == true ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 2,
                paddingVertical: 2,
                height: 20,
              }}>
              <View
                style={{
                  width: 55,
                  height: 20,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{textAlign: 'center', color: 'white', fontSize: 10}}>
                  {header.rate}%
                </Text>
              </View>
              <View
                style={{
                  width: 55,
                  height: 20,
                  backgroundColor: 'orange',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{textAlign: 'center', color: 'white', fontSize: 10}}>
                  {header.option1}
                </Text>
              </View>
              <View
                style={{
                  width: 55,
                  height: 20,
                  backgroundColor: 'black',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{textAlign: 'center', color: 'white', fontSize: 10}}>
                  {header.option2}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 2,
                paddingVertical: 2,
                height: 20,
              }}>
              <View
                style={{
                  width: 55,
                  height: 20,
                  justifyContent: 'center',
                }}
              />
              <View
                style={{
                  width: 55,
                  height: 20,
                  justifyContent: 'center',
                }}
              />
              <View
                style={{
                  width: 55,
                  height: 20,
                  justifyContent: 'center',
                }}
              />
            </View>
          )}

          <View style={{height: 130, marginTop: 8}}>
            <SwiperFlatList
              index={0}
              showPagination
              paginationDefaultColor={'rgba(0,0,0,0.2)'}
              paginationActiveColor={this.props.themeStyle.primaryBackground}
              paginationStyleItem={{
                width: 8,
                height: 8,
                marginLeft: 3,
                marginRight: 3,
                marginBottom: -5,
              }}>
              {Array(4)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Image
                      placeholder={false}
                      key={index}
                      style={{width: 160, height: 120}}
                      resizeMode={'cover'}
                      source={imgLink}
                    />
                  );
                })}
            </SwiperFlatList>
          </View>
        </View>
        <View
          style={grid ? {padding: 5} : {width: '50%', padding: 10, top: 30}}>
          <Text
            style={{
              color: 'black',
              fontSize: 11,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            {title}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{textDecorationLine: 'line-through'}}>
              KWD {priceOld}
            </Text>
            <FontAwesome name={'heart'} style={{color: 'gray', fontSize: 15}} />
          </View>
          <Text style={{color: 'red'}}>KWD {priceCurrent}</Text>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            {smallImageList.map((item, index) => (
              <View key={index} style={styles.smallImageItem}>
                <Image style={styles.smallImage} source={item} />
              </View>
            ))}
          </View>
          {/* <View style={{ flexDirection: 'row' }}>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Day</Text>
              <Text style={styles.timeText}>{time.days}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Hrs</Text>
              <Text style={styles.timeText}>{time.hrs}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Min</Text>
              <Text style={styles.timeText}>{time.mins}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Sec</Text>
              <Text style={styles.timeText}>{time.seconds}</Text>
            </View>
          </View> */}
          {/* <TouchableOpacity style={styles.cartBtn} onPress={() => this.handleAddCart()}> */}
          {/* <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('ProductDetailScreen')}> */}
          {grid ? (
            <View>
              <TouchableOpacity
                style={styles.addCartBtn}
                onPress={() => console.log('Add to cart')}>
                <Text style={styles.cartBtnText}>Add To Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cart2Btn}
                onPress={() => console.log('Buy Now')}>
                <Text style={styles.cartBtnText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.add2CartBtn}
                  onPress={() => console.log('Add to cart')}>
                  <Text style={styles.cartBtnText}>Add To Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cartBtn}
                  onPress={() => console.log('Buy Now')}>
                  <Text style={styles.cartBtnText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            ) && homeView ? (
            <TouchableOpacity
              style={styles.add2CartBtn}
              onPress={() => console.log('Add to cart')}>
              <Text style={styles.cartBtnText}>Add To Cart</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
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

const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
});
const mapDispatchToProps = dispatch => ({
  // handleAddCart: this.props.handleAddCart(),
  // handleAddCart: () => {
  //   this.props.handleAddCart();
  // },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductItem);

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderWidth: 1,
    margin: 5,
  },
  container1: {
    flex: 1,
    height: 165,
    elevation: 1,
    opacity: 1,
    shadowRadius: 5,
    shadowColor: 'black',
    borderWidth: 0.25,
    borderColor: 'white',
    margin: 5,
    flexDirection: 'row',
  },
  timeItem: {
    width: 22,
    height: 22,
    backgroundColor: 'black',
    marginRight: 2,
  },
  timeText: {
    fontSize: 8,
    color: 'white',
  },

  smallImageItem: {borderWidth: 1, marginRight: 2},
  smallImage: {width: 20, height: 20},

  cartBtn: {
    width: '50%',
    backgroundColor: 'orange',
    // alignSelf: 'center',
    height: 22,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  cart2Btn: {
    width: '100%',
    backgroundColor: 'orange',
    // alignSelf: 'center',
    height: 22,
    justifyContent: 'center',
  },
  addCartBtn: {
    width: '100%',
    backgroundColor: 'black',
    // alignSelf: 'center',
    height: 25,
    marginBottom: 3,
    justifyContent: 'center',
  },
  add2CartBtn: {
    width: '50%',
    backgroundColor: 'black',
    // alignSelf: 'center',
    height: 22,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  cartBtnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
  },
});
