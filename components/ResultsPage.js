'use strict';

import React from 'react';
import {Image, Button, View, Text} from 'react-native';
// import {Button} from 'react-native-elements';

import NavigationService from 'utils/NavigationService.js';

export default class ResultsPage extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{textAlign: 'center', color: '#333', marginBottom: 5}}>
          Image URL: {JSON.stringify(navigation.state.params.imageUrl)}
        </Text>
        <Image
          style={{width: 200, height: 200}}
          source={{uri: navigation.state.params.imageUrl}}
        />
        <Text style={{textAlign: 'center', color: '#333', marginBottom: 5}}>
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
        <Button title="Yes " />
        <View style={{height: 10}} />
        <Button
          title="No "
          onPress={() =>
            NavigationService.navigate('ImagePreview', {
              imageUrl: navigation.state.params.imageUrl,
            })
          }
        />
      </View>
    );
  }
}
