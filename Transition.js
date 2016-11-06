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
const CELL_SIZE = Math.floor(width * .2); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .07); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 1;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = Math.floor(TILE_SIZE * .6);
const conatinerWidth = width > 400 ? 300 : width * .8

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
    this.props.addBonus(Math.floor(this.getBonus() * this.props.score))
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

  getBonus() {
    const { difficulty } = this.props
    if(difficulty === 'Easy') { return 1.3 }
    if(difficulty === 'Medium') { return 2 }
    if(difficulty === 'Hard') { return 3 }
    if(difficulty === 'Extreme') { return 4 }
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderStats()}
        </View>
        )
  }

  renderTile(char) {
    return (
      <View style={[styles.tile]}>
        <Text allowFontScaling={false} style={{ fontFamily: 'American Typewriter', fontSize: width * .07 }}>{char}</Text>
      </View>
    )
  }

  renderStats() {
    const { level, score } = this.props
    const bonus = this.getBonus()
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.fadeAnim2, flexDirection: 'column', alignItems: 'center', flex: 1}}>
          <Text allowFontScaling={false} style={styles.headerText}>Difficulty Bonus:</Text>
          <Text allowFontScaling={false} style={styles.headerText}>{Math.floor((bonus - 1) * 100) + '%'}</Text>
          <Text allowFontScaling={false} style={styles.userText}>Level:</Text>
          {this.renderTile(level)}
          <Text allowFontScaling={false} style={styles.userText}>Score:</Text>
          {this.renderTile(score)}
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Button action={this.props.continue} text={'Continue'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3, paddingBottom: 40}}>
          <Button action={this.props.quit} text={'Quit'}/>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    width: conatinerWidth
  },
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: Scheme.color3,
    fontFamily: 'American Typewriter'
  },
  headerText: {
    alignSelf: 'center',
    marginBottom: width * .02,
    fontSize: width * .07,
    color: Scheme.color5,
    fontFamily: 'American Typewriter'
  },
  userText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: width * .07,
    color: 	Scheme.color3,
    fontFamily: 'American Typewriter'
  },
  tile: {
    width: TILE_SIZE * 2,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Scheme.color3,
    borderColor: Scheme.color5,
    borderWidth: 3,
    marginBottom: width * .1
  },
});

export default Transition;
