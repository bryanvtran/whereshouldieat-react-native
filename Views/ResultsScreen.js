import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

export default class ResultScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.food} near ${navigation.state.params.location}`
  });

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.state = {
      businesses: params.businesses
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.businesses}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => <Text>{item.name}</Text>}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  }
});
