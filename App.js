import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Where Should I Eat?'
  }
  constructor(props) {
    super(props);
    this.state = {
      food: 'Burgers',
      location: 'Phoenix'
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Food"
          onChangeText={(text) => this.setState({ food: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={(text) => this.setState({ location: text })}
        />
        <Button
          onPress={() => navigate('Result', {
            food: this.state.food,
            location: this.state.location
          })}
          title="Search"
        />
      </View>
    );
  }
}

class ResultScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.food} in ${navigation.state.params.location}`
  });

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.state = {
      loading: true
    }

    fetch('https://api.yelp.com/v3/businesses/search?term='+params.food+'&location='+params.location, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer yiQpEO7eS-iMwnNbENqMeft6wydLSSiHHW7DPsWaj5ZO_ZE_USzlnUbv2E04vsPQaTO4b8Tm9JPBfj1joelvm2kRqOYj-ruYnPKRGqOzVJmGroKWC4qyNBG2K8CAWXYx'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.businesses.forEach(function(business) {
        console.log(business.name)
      })
      this.setState({
        businesses: responseJson.businesses,
        loading: false
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.businesses}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => <Text>{item.name}</Text>}
        />
        <ActivityIndicator
          animating={this.state.loading}
          style={styles.spinner}
          size='large'
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
  },
  input: {
    height: 40,
    margin: 5,
    borderBottomWidth: 1,
    borderColor: 'gainsboro'
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }

});

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Result: { screen: ResultScreen }
});
