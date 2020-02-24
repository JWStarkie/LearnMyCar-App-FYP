'use strict';

import React from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';

import NavigationService from 'utils/NavigationService.js';

export default class ResultsPage extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', color: '#333', marginBottom: 5 }}>
          Image URL: {JSON.stringify(navigation.state.params.imageUrl)}
        </Text>
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: navigation.state.params.imageUrl }}
        />
        <Text style={{ textAlign: 'center', color: '#333', marginBottom: 5 }}>
          Predicted Make: {JSON.stringify(navigation.state.params.prediction)}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: '#3A88E9',
            padding: 15,
          }}>
          Is this your vehicle make?
        </Text>
        <View style={{ height: 10 }} />
        <TouchableOpacity style={{ height: 10 }} activeOpacity={0.5}>
          <Image
            source={require('assets/yes-icon.png')}
            style={{ height: 5, width: 5 }}
          />
          <Text> Yes </Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity
          style={{ height: 10 }}
          activeOpacity={0.5}
          onPress={() =>
            NavigationService.navigate('ImagePreview', {
              imageUrl: navigation.state.params.imageUrl,
            })
          }>
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
