# Where Should I Eat (React Native Demo)

## Introduction
Features:

 * React Native application with 2-3 views
 * Native features such as geolocation
 * Uses Yelp API
 * Introduces mobile paradigms

Prerequisites:

 * Sign up for the [Yelp API](https://www.yelp.com/developers/documentation/v3/) to get token
 * Download [react native cli](https://facebook.github.io/react-native/docs/getting-started.html) and other stuff necessary for demo (Mac - Xcode, windows - android stuff)
 * Familiarize self with javascript, html/css (exposure to web development)

Setting up the application:

```sh
create-react-native-app myapp
cd myapp
npm run ios
```

## HomeScreen


Implement basic components and styles. Introduce concept of state.

App.js
```javascript
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      food: '',
      location: ''
    };
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 5,
    borderBottomWidth: 1,
    borderColor: 'gainsboro'
  },
});
```

Full implementation of home screen (without navigation and geolocation)

```javascript
import React from 'react';
import { Alert, ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      food: '',
      location: '',
      loading: false
    };
  }

  _search() {
    if (!this.state.food || !this.state.location) {
      return false;
    }

    this.setState({ loading: true });

    var url = 'https://api.yelp.com/v3/businesses/search?term='+this.state.food;
    url += '&location='+this.state.location;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer yiQpEO7eS-iMwnNbENqMeft6wydLSSiHHW7DPsWaj5ZO_ZE_USzlnUbv2E04vsPQaTO4b8Tm9JPBfj1joelvm2kRqOYj-ruYnPKRGqOzVJmGroKWC4qyNBG2K8CAWXYx'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        loading: false
      });
      if (responseJson.businesses.length > 0) {
        console.log(responseJson);
      }
      else {
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
      <TextInput
        style={styles.input}
        placeholder="Location"
        onChangeText={(text) => this.setState({ location: text })}
        value={this.state.location}
      />
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
});
```

Full Implementation with navigation

First, we need to install react-navigation

```bash
npm install --save react-navigation
```

```javascript
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Where Should I Eat?'
  }
  constructor(props) {
    super(props);
    this.state = {
      food: 'Burgers',
      location: 'Phoenix',
      currentLocation: null,
      loading: false
    };
  }

  _locateButtonPressed() {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({
      currentLocation: pos.coords,
      location: 'You'
    }));
  }

  _search() {
    if (!this.state.food || !this.state.location) {
      return false;
    }

    this.setState({ loading: true });

    var url = 'https://api.yelp.com/v3/businesses/search?term='+this.state.food;
    url += '&location='+this.state.location;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer yiQpEO7eS-iMwnNbENqMeft6wydLSSiHHW7DPsWaj5ZO_ZE_USzlnUbv2E04vsPQaTO4b8Tm9JPBfj1joelvm2kRqOYj-ruYnPKRGqOzVJmGroKWC4qyNBG2K8CAWXYx'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        loading: false
      });
      if (responseJson.businesses.length > 0) {
        this.props.navigation.navigate('Result', {
          food: this.state.food,
          location: this.state.location,
          businesses: responseJson.businesses
        });
      }
      else {
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
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={(text) => this.setState({ location: text, currentLocation: null })}
          value={this.state.location}
        />
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
  Home: { screen: HomeScreen }
});
```

Refactoring to separate the homescreen and the navigation

App.js

```javascript
import { StackNavigator } from 'react-navigation';

import HomeScreen from './Views/HomeScreen';
import ResultScreen from './Views/ResultsScreen';

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Result: { screen: ResultScreen }
});
```

Views/HomeScreen.js

```javascript
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Where Should I Eat?'
  }
  constructor(props) {
    super(props);
    this.state = {
      food: 'Burgers',
      location: 'Phoenix',
      currentLocation: null,
      loading: false
    };
  }

  _locateButtonPressed() {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({
      currentLocation: pos.coords,
      location: 'You'
    }));
  }

  _search() {
    if (!this.state.food || !this.state.location) {
      return false;
    }

    this.setState({ loading: true });

    var url = 'https://api.yelp.com/v3/businesses/search?term='+this.state.food;
    url += '&location='+this.state.location;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer yiQpEO7eS-iMwnNbENqMeft6wydLSSiHHW7DPsWaj5ZO_ZE_USzlnUbv2E04vsPQaTO4b8Tm9JPBfj1joelvm2kRqOYj-ruYnPKRGqOzVJmGroKWC4qyNBG2K8CAWXYx'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        loading: false
      });
      if (responseJson.businesses.length > 0) {
        this.props.navigation.navigate('Result', {
          food: this.state.food,
          location: this.state.location,
          businesses: responseJson.businesses
        });
      }
      else {
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
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={(text) => this.setState({ location: text, currentLocation: null })}
          value={this.state.location}
        />
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
```

Views/ResultsScreen.js

```javascript
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native';

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
        <Text>TestText</Text>
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
  listItem: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro'
  },
  listItemImage: {
    flex: 2,
    height: 50
  },
  listItemText: {
    flex: 8,
    fontSize: 16,
    paddingLeft: 8,
  }
});

```


Creating the results screen and updating the navigation

ResultsScreen.js

```javascript
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native';

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
          renderItem={({item}) => <ListItem item={item} screenProps={{ rootNavigation: this.props.navigation }}/> }
        />
      </View>
    )
  }
}

class ListItem extends Component {
  _onPressBusiness() {
    this.props.screenProps.rootNavigation.navigate('Detail', {
      business: this.props.item
    });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={ this._onPressBusiness.bind(this) }
        underlayColor='transparent'
        activeOpacity={.5} >
        <View style={styles.listItem}>
          <Image
            style={styles.listItemImage}
            source={{ uri: this.props.item.image_url }}
          />
          <Text style={styles.listItemText}>{this.props.item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  listItem: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro'
  },
  listItemImage: {
    flex: 2,
    height: 50
  },
  listItemText: {
    flex: 8,
    fontSize: 16,
    paddingLeft: 8,
  }
});

```

Adding geolocation to the homepage, might need to download the location icon too

```javascript
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Where Should I Eat?'
  }
  constructor(props) {
    super(props);
    this.state = {
      food: 'Burgers',
      location: 'Phoenix',
      currentLocation: null,
      loading: false
    };
  }

  _locateButtonPressed() {
    navigator.geolocation.getCurrentPosition((pos) => this.setState({
      currentLocation: pos.coords,
      location: 'You'
    }));
  }

  _search() {
    this.setState({ loading: true });

    var url = 'https://api.yelp.com/v3/businesses/search?term='+this.state.food;
    if (this.state.currentLocation === null) {
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
            onChangeText={(text) => this.setState({ location: text, currentLocation: null })}
            value={this.state.location}
          />
          <TouchableHighlight
            style={styles.locateButton}
            onPress={this._locateButtonPressed.bind(this)}
            underlayColor={'transparent'}
          >
            <Image
              style={styles.locateImage}
              source={require('../navigation-icon.png')}
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
```

Adding a DetailSceen.js

App.js

```javascript
import { StackNavigator } from 'react-navigation';

import HomeScreen from './Views/HomeScreen';
import ResultScreen from './Views/ResultsScreen';
import DetailScreen from './Views/DetailScreen';

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Result: { screen: ResultScreen },
  Detail: { screen: DetailScreen }
});
```

Views/DetailSceen.js

```javascript
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
```
