import React from 'react';
import Logo from './Logo.js'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Scores extends React.Component {
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
          {this.renderButtons()}
        </View>
        )
  }

  renderButtons() {
    const { scores } = this.props
    return (
      <View>
        {/*<Logo />*/}
        <Animated.View style={{opacity: this.state.fadeAnim1}}>
          <Text allowFontScaling={false} style={styles.buttonText}>High Scores</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text allowFontScaling={false} style={styles.buttonText}>scores['user_score']</Text>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: Scheme.color3,
    fontFamily: 'American Typewriter'
  },
});

export default Scores;
