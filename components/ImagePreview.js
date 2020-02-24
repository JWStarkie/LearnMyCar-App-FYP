'use strict';

import React from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';

export default class ImagePreview extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: '#3A88E9',
            padding: 15,
          }}>
          Would you like to help improve our application by uploading your
          picture to our training portal?
        </Text>
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: navigation.state.params.imageUrl }}
        />
        <View style={{ height: 10 }} />
        <TouchableOpacity style={{ height: 10 }} activeOpacity={0.5}>
          <Image
            source={require('assets/yes-icon.png')}
            style={{ height: 5, width: 5 }}
          />
          <Text> Yes </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 10 }} activeOpacity={0.5}>
          <Image
            source={require('assets/no-icon.png')}
            style={{ height: 5, width: 5 }}
          />
          <Text> No </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
