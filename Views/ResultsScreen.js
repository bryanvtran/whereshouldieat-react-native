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
