"use strict";

import React from "react";
import { View, Text } from "react-native";

export default class AR extends React.Component {
  render() {
    const { navigation } = this.props;
    console.log("AR  Page");
    console.log(navigation.state.params);
    if (navigation.state.params) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textAlign: "center", color: "#333", marginBottom: 5 }}>
            {JSON.stringify(navigation.state.params.probability)} % chance it's
            a {JSON.stringify(navigation.state.params.classification)}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textAlign: "center", color: "#333", marginBottom: 5 }}>
            We couldn't predict your vehicle.
          </Text>
        </View>
      );
    }
  }
}
