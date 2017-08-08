import React, { Component } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

export default class ResultScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.business.name}`
  });

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    this.state = {
      business: params.business
    }
    console.log(this.state);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
        style={styles.image}
        resizeMode={'cover'}
        source={{ uri: this.state.business.image_url }}/>
        <View style={styles.innerContainer}>
          <Text>{this.state.business.name}</Text>
          <Text>{this.state.business.rating}/5 ({this.state.business.review_count} reviews) | {this.state.business.price}</Text>
          <Text>{this.state.business.location.display_address[0]}</Text>
          <Text>{this.state.business.location.display_address[1]}</Text>
          <Text>{this.state.business.location.display_address[2]}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
  },
  innerContainer: {
    padding: 8
  },
  image: {
    height: 200,
  },

});
