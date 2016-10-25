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

class ScoreBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0),
      spinValue: new Animated.Value(0),
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
    this.spin()
  }

  spin () {
    this.state.spinValue.setValue(1)
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 0,
        duration: 10000,
        easing: Easing.easeInEaseOut
      }
    ).start(() => this.spin())
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderButtons()}
        </View>
        )
  }

  renderHighScores() {
    const { highScores } = this.props
    if(highScores.high_scores) {
      toShow = highScores.high_scores.sort((a, b) => b[1] - a[1])
      return toShow.map(function(score, index) {
        return (
          <View key={index}>
            <Text style={styles.buttonText}>{score[0]}: {score[1]}</Text>
          </View>
        )
      })
    } else {
      return (
        <View key={1}>
          <Text style={styles.buttonText}>Offline Mode</Text>
        </View>
      )
    }

  }

  renderButtons() {
    const { highScores } = this.props
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <View>
        <View style={styles.spinner}>
          <Animated.Text style={{
            color: 'gold',
            fontSize: width * .25,
            fontFamily: 'American Typewriter',
            opacity: .9,
            transform: [{rotate: spin}] }}>{"\u2B50"}</Animated.Text>
        </View>
        <Animated.View style={{opacity: this.state.fadeAnim1}}>
          <Text style={styles.headerText}>The Legends</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          {this.renderHighScores()}
          <Text style={styles.userText}>You: {highScores['user_score'] ? highScores['user_score'] : 0}</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <Button action={this.props.backToMenu} text={'\u2190 \u2190 \u2190'}/>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    margin: height * .01,
    fontSize: height * .04,
    color: Scheme.color5,
    fontFamily: 'Iowan Old Style'
  },
  headerText: {
    alignSelf: 'center',
    margin: height * .026,
    fontSize: height * .07,
    color: Scheme.color4,
    fontFamily: 'American Typewriter',
    backgroundColor: 'transparent'
  },
  userText: {
    alignSelf: 'center',
    margin: height * .013,
    fontSize: height * .04,
    color: Scheme.color1,
    fontFamily: 'American Typewriter'
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * .08,
    marginBottom: height * .01
  }
});

export default ScoreBoard;
