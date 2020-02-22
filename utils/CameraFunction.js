'use strict';

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {camera} from '@fortawesome/free-solid-svg-icons';

import AzureConnection from 'utils/AzureConnection.js';

import NavigationService from './NavigationService';

export default class CameraFunction extends Component {
  state = {
    hasPermission: null,
    type: RNCamera.Constants.Type.back,
    processing: null,
    makePredicted: false,
  };

  async componentDidMount() {
    const {status} = await RNCamera.requestPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  render() {
    if (this.props.navigation.state.params.makePredicted) {
      this.setState({makePredicted: true});
    }
    const {hasPermission} = this.state;
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return (
        <View style={styles.viewOne}>
          <Text style={styles.textOne}>
            No authorisation to access to camera, please give this application
            permission to continue!! You must now do this through your setting
            or restart the application!!
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{flex: 1}}
            type={this.type}>
            <View style={styles.overlayStyle}>
              <View style={styles.overlayHeaderFooter} />
              <View style={styles.overlayMiddle}>
                <View style={styles.overlayMiddleSides} />
                <View style={styles.overlayTransparent} />
                <View style={styles.overlayMiddleSides} />
              </View>
              <View style={styles.overlayHeaderFooter} />
            </View>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this._handleclick()}
              disabled={this.state.processing}>
              {this.state.processing ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  animating={this.state.processing}
                />
              ) : null}
              <FontAwesomeIcon icon={camera} style={styles.fontA} />
            </TouchableOpacity>
          </RNCamera>
        </View>
      );
    }
  }

  _handleclick() {
    console.log('makePredicted = ' + this.state.makePredicted);
    if (!this.state.makePredicted) {
      this.takePictureMake();
      // Thing to be done next - modal pop-up
    } else {
      this.takePictureModel();
    }
  }

  takePictureMake = async () => {
    console.log('takePictureMake');
    this.setState({processing: true});
    if (this.camera) {
      if (this.props.navigation.state.params.trainNewVehicle) {
        console.log('Train new vehicle');
        await this.camera
          .takePictureAsync({skipProcessing: true})
          .then(data => {
            NavigationService.navigate('ImagePreview', {
              imageUri: data.uri,
              totrain: this.props.navigation.state.params.trainNewVehicle,
            });
          });
      } else {
        console.log('Predict Vehicle');
        await this.camera
          .takePictureAsync({
            quality: 0.9,
            base64: true,
          })
          .then(data => {
            AzureConnection.handleAzure(data.base64).then(data => {
              console.log("we're here.");
              console.log(data);
              console.log('Now here..');
              NavigationService.navigate('ResultsPage', {
                imageUrl: data.response1,
                prediction: data.response2,
              });
              return data;
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };
  takePictureModel = async () => {
    console.log('takePictureModel');
    /*  this.setState({ processing: true });
    if (this.camera) {
      if (this.props.navigation.state.params.trainNewVehicle) {
        console.log("Train new vehicle");
        await this.camera
          .takePictureAsync({ skipProcessing: true })
          .then(data => {
            NavigationService.navigate("ImagePreview", {
              imageUri: data.uri,
              totrain: this.props.navigation.state.params.trainNewVehicle
            });
          });
      } else {
        console.log("Predict Vehicle");
        await this.camera
          .takePictureAsync({
            quality: 0.9,
            base64: true
          })
          .then(data => {
            // console.log(data);
            AzureConnection.predictVehicleMakeWithImageFile(data.base64);
            //             NavigationService.navigate("ImagePreview", {
            //   imageUri: data.uri,
            //   totrain: this.props.navigation.state.params.trainNewVehicle
            // });
          });
      }
    } */
  };
}

const styles = StyleSheet.create({
  viewOne: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOne: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  overlayStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  overlayTransparent: {
    width: 300,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderWidth: 3,
  },
  overlayMiddle: {
    flex: 2,
    flexDirection: 'row',
  },
  overlayMiddleSides: {
    width: '50%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayHeaderFooter: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  touchable: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  fontA: {
    color: '#fff',
    fontSize: 40,
    backgroundColor: '#000',
    padding: 10,
  },
});
