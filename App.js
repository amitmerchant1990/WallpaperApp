import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  AppRegistry,
  ActivityIndicator,
  Dimensions
} from 'react-native';

var RandManager = require('./RandManager.js');
var Swiper = require('react-native-swiper');
var NetworkImage = require('react-native-image-progress').default;
//var Progress = require('react-native-progress');

var {width, height} = Dimensions.get('window');

const NUM_WALLPAPERS = 5;

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };
  }

  render() {
    var {isLoading} = this.state;

    if(isLoading){
      return this.renderLoadingMessage();
    }else{
      return this.renderResults();
    }
  }

  fetchWallsJSON(){
      console.log('Wallpapers will be fetched.');
      var url = 'http://unsplash.it/list';
      fetch(url)
        .then(response => response.json())
        .then(jsonData => {
          console.log(jsonData);
          var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
          var walls = [];
          randomIds.forEach(randomId => {
            walls.push(jsonData[randomId]);
          });

          this.setState({
            isLoading: false,
            wallsJSON: [].concat(walls)
          });
        })
        .catch( error => console.log('Fetch error ' + error) );
  }

  componentDidMount(){
    this.fetchWallsJSON();
  }

  renderLoadingMessage(){
    return(
      <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            color={'#fff'}
            size={'small'} 
            style={{margin: 15}} />
            <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
        
      </View>
    );
  }

  renderResults() {
    var {wallsJSON, isLoading} = this.state;
    if( !isLoading ) {
      return (
      <Swiper> 
      
          {wallsJSON.map((wallpaper, index) => {
            let wall_uri = `https://picsum.photos/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`;
            return (
              <View key={index}>
                <NetworkImage
                  source={{uri: wall_uri}}
                  style={styles.wallpaperImage}>
                </NetworkImage>
              </View>
            );
          })}
        
      </Swiper>

      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF', 
  },
  loadingContainer: {
	  flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  wallpaperImage: {
    width: width,
    height: height
  }
});
