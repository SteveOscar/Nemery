import React from 'react';
import Logo from './Logo.js'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
    LayoutAnimation
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0),
      fadeAnim4: new Animated.Value(0)
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
    Animated.timing(
      this.state.fadeAnim4,
      {
        toValue: 1,
        duration: 1000,
        delay: 1500
      }
    ).start();
  }

  renderDifficulty() {
    const { difficulty } = this.props
    if(difficulty === "Easy") { return "\uD83D\uDE00" }
    if(difficulty === "Medium") { return "\uD83D\uDE10" }
    if(difficulty === "Hard") { return "\uD83D\uDE33" }
  }

  render() {
    return (
      <View>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    let howHard = this.renderDifficulty()

    return (
      <View>
        <Logo />
        <Animated.View style={{opacity: this.state.fadeAnim1}}>
          <Text style={styles.buttonText} onPress={this.props.startGame}>Start</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text style={styles.buttonText} onPress={this.props.upDifficulty}>Difficulty: {howHard}</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <Text style={styles.buttonText} onPress={this.props.highScoresPage}>High Scores</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim4}}>
          <Text style={styles.buttonText} onPress={this.props.highScoresPage}>?</Text>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  continer: {
    paddingBottom: 200
  },
  buttonText: {
    alignSelf: 'center',
    margin: height * .03,
    fontSize: 30,
    color: 	'#fff4e6',
    fontFamily: 'American Typewriter'
  },
});

export default Menu;
