"use strict";

import React from "react";
import { View, Text } from "react-native";

export default class NotFound extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", color: "#333", marginBottom: 5 }}>
          Hello NotFound
        </Text>
        {/* 2. Get the param, provide a fallback value if not available */}
        <Text>
          itemId: {JSON.stringify(navigation.getParam("itemId", "NO-ID"))}
        </Text>
        <Text>
          otherParam:{" "}
          {JSON.stringify(navigation.getParam("otherParam", "default value"))}
        </Text>
      </View>
    );
  }
}
//can also access directly via this.props.navigation.state.params
//  using this.props.navigation.state.params
