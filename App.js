import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Where Should I Eat?'
  }
  constructor(props) {
    super(props);
    this.state = {
      food: 'Burgers',
      location: 'Phoenix',
      loading: false
    };
  }

  _locateButtonPressed() {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({
      currentLocation: pos.coords,
      location: 'Current Location'
    }));
  }

  _search() {
    this.setState({ loading: true });

    var url = 'https://api.yelp.com/v3/businesses/search?term='+this.state.food;
    if (!this.state.currentLocation) {
      url += '&location='+this.state.location;
    }
    else {
      url += '&latitude=' + this.state.currentLocation.latitude + '&longitude=' + this.state.currentLocation.longitude;
    }

    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer yiQpEO7eS-iMwnNbENqMeft6wydLSSiHHW7DPsWaj5ZO_ZE_USzlnUbv2E04vsPQaTO4b8Tm9JPBfj1joelvm2kRqOYj-ruYnPKRGqOzVJmGroKWC4qyNBG2K8CAWXYx'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.businesses.length > 0) {
        this.setState({
          loading: false
        });
        this.props.navigation.navigate('Result', {
          food: this.state.food,
          location: this.state.location,
          businesses: responseJson.businesses
        });
      }
      else {
        this.setState({
          loading: false
        });
        Alert.alert('No places found.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Food"
          onChangeText={(text) => this.setState({ food: text })}
          value={this.state.food}
        />
        <View>
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(text) => this.setState({ location: text })}
            value={this.state.location}
          />
          <TouchableHighlight
            style={styles.locateButton}
            onPress={this._locateButtonPressed.bind(this)}
            underlayColor={'transparent'}
          >
            <Image
              style={styles.locateImage}
              source={require('./navigation-icon.png')}
            />
          </TouchableHighlight>
        </View>
        <Button
          onPress={this._search.bind(this)}
          title="Search"
          disabled={this.state.loading}
        />
        <ActivityIndicator
          animating={this.state.loading}
          style={styles.spinner}
          size='large'
        />
      </View>
    );
  }
}

class ResultScreen extends Component {
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
  },
  input: {
    height: 40,
    margin: 5,
    borderBottomWidth: 1,
    borderColor: 'gainsboro'
  },
  spinner: {
  },
  locateButton: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  locateImage: {
    width: 20,
    height: 20
  }
});

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Result: { screen: ResultScreen }
});
