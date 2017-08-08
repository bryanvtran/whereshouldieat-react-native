import { StackNavigator } from 'react-navigation';

import HomeScreen from './Views/HomeScreen';
import ResultScreen from './Views/ResultsScreen';
import DetailScreen from './Views/DetailScreen';

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Result: { screen: ResultScreen },
  Detail: { screen: DetailScreen }
});
