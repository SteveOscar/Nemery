import React from 'react';
import Logo from './Logo.js'
import Button from './Button.js'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Transition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim1,
      {
        toValue: 1,
        duration: 1000
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim2,
      {
        toValue: 1,
        duration: 1000,
        delay: 500
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim3,
      {
        toValue: 1,
        duration: 1000,
        delay: 1000
      }
    ).start();
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderStats()}
        </View>
        )
  }

  renderStats() {
    const { level, score } = this.props
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text style={styles.userText}>Level: {level}</Text>
          <Text style={styles.userText}>Score: {score}</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Button action={this.props.continue} text={'Continue'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <Button action={this.props.quit} text={'Quit'}/>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    width: width
  },
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: 	'#fff4e6',
    fontFamily: 'American Typewriter'
  },
  headerText: {
    alignSelf: 'center',
    margin: 20,
    fontSize: 40,
    color: 	'black',
    fontFamily: 'American Typewriter'
  },
  userText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: 	'yellow',
    fontFamily: 'American Typewriter'
  }
});

export default Transition;
