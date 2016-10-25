import React from 'react';
import Logo from './Logo.js'
import Button from './Button.js'
import Scheme from './colorScheme.js'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Help extends React.Component {
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
    ).start()
  }


  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.bigText}>HELP</Text>
          <Animated.View style={{opacity: this.state.fadeAnim1}}>
            <Text style={styles.helpText}>Turn the tiles over in order</Text>
            <Text style={styles.helpText}>Higher levels  =  Less time</Text>
            <Text style={styles.helpText}>More difficutly  =  More points</Text>
            <Text style={styles.helpText}>More points  =  More fame</Text>
            <Text style={styles.helpText}>More fame  =  More problems</Text>
          </Animated.View>
          <Animated.View style={{opacity: this.state.fadeAnim2}}>
            <Text style={styles.userText}> </Text>
            <Text style={styles.userText}>Comments or Questions:</Text>
            <Text style={styles.userText}>support@StevenOscarOlson.com</Text>
            <Text style={styles.userText}> </Text>
            <Text style={styles.smallText}>If you enjoy this game, please leave a review in the app store {`\uD83D\uDC4C`}</Text>
          </Animated.View>
          <Animated.View style={{opacity: this.state.fadeAnim3, paddingBottom: 80, width: width * .7}}>
            <Button action={this.props.backToMenu} text={'\u2190 \u2190 \u2190'}/>
          </Animated.View>
        </View>
        )
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  helpText: {
    alignSelf: 'center',
    margin: height * .006,
    fontSize: width * .05,
    color: Scheme.color4,
    fontFamily: 'American Typewriter',
    backgroundColor: 'transparent'
  },
  userText: {
    marginTop: height * .02,
    textAlign: 'center',
    margin: height * .013,
    fontSize: width * .05,
    color: Scheme.color5,
    fontFamily: 'American Typewriter'
  },
  smallText: {
    marginBottom: height * .03,
    textAlign: 'center',
    margin: height * .013,
    fontSize: width * .035,
    color: Scheme.color5,
    fontFamily: 'American Typewriter'
  },
  bigText: {
    marginBottom: height * .03,
    textAlign: 'center',
    margin: height * .013,
    fontSize: width * .1,
    color: Scheme.color5,
    fontFamily: 'American Typewriter'
  }
});

export default Help;
