import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return <View style={styles.container}>
            {this.renderButtons()}
           </View>
  }

  renderButtons() {
    return (
      <View>
        <Text style={styles.buttonText} onPress={this.props.startGame}>Start</Text>
        <Text style={styles.buttonText} onPress={this.props.upDifficulty}>Difficulty: {this.props.difficulty}</Text>
        <Text style={styles.buttonText}>Button 3</Text>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: 'tan'
  },
});

export default Menu;
