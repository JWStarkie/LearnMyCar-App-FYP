'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import AzureConnection from 'utils/AzureConnection.js';

import NavigationService from './NavigationService';

export default class CameraFunction extends Component {
  state = {
    hasPermission: 'granted' === PermissionsAndroid.RESULTS.GRANTED,
    type: RNCamera.Constants.Type.back,
    processing: null,
    makePredicted: false,
  };

  async componentDidMount() {
    try {
      this.requestPermissions();
    } catch (err) {
      console.warn(err);
    }
  }

  async requestPermissions() {
    try {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission to use your camera',
          message: 'LearnMyCar needs permission to use your camera.',
          buttonPositive: 'Ok',
        },
      );
      console.log('Permission status = ' + status);
      if (status === 'granted') {
        this.setState({ hasPermission: status === 'granted' });
        console.log('For fucks sake!');
      } else {
        this.setState({ hasPermission: status === 'granted' });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    if (this.props.navigation.state.params.makePredicted) {
      this.setState({ makePredicted: true });
    }
    const { hasPermission } = this.state;
    console.log(hasPermission);
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return (
        <View style={styles.viewOne}>
          <Text style={styles.textOne}>
            No authorisation to access to camera, please give this application
            permission to continue!! You must now do this through your settings
            or restart the application!!
          </Text>
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: '#3A88E9' }}
            onPress={() => this.requestPermissions()}>
            <Text> Update Camera Settings </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.cameraView}
            type={this.type}
            captureAudio={false}>
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
              <Image
                source={require('assets/camera-icon-grey.png')}
                style={styles.iconSize}
              />
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
    this.setState({ processing: true });
    if (this.camera) {
      if (this.props.navigation.state.params.trainNewVehicle) {
        console.log('Train new vehicle');
        await this.camera.takePictureAsync({ skipProcessing: true });
        //   .then(data => {
        //     NavigationService.navigate('ImagePreview', {
        //       imageUri: data.uri,
        //       totrain: this.props.navigation.state.params.trainNewVehicle,
        //     });
        //   });
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
  cameraView: {
    flex: 1,
  },
  touchable: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  iconSize: {
    height: 50,
    width: 50,
    padding: 10,
  },
});
