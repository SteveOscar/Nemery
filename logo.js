import React from 'react';
import Scheme from './colorScheme.js'
const DeviceInfo = require('react-native-device-info');

import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
const CELL_SIZE = Math.floor(width * .15); // 15% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .07); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 1;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = Math.floor(TILE_SIZE * .6);

class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.makeBoard(),
      fadeAnim: new Animated.Value(0),
      numbers: ['N', 'U', 'M', 'E', 'R', 'Y']
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 1000
      }
    ).start();

    const first = this.randomIndex(0, 5)
    const second = this.randomIndex(0, 5, first)

    setTimeout(() => { this.moveTile(first) }, 800)
    setTimeout(() => { this.moveTileBack(first) }, 1600);

    // setTimeout(() => { this.spinTile(second) }, 400)
    setTimeout(() => { this.moveTile(second) }, 1700)
    setTimeout(() => { this.moveTileBack(second) }, 2600);
  }

  randomIndex(min, max, first) {
    if(!first) { return Math.floor(Math.random() * (max - min + 1)) + min }
    let second = first
    while (second == first) {
      second = Math.floor(Math.random() * (max - min + 1)) + min
    }
    return second
  }

  makeBoard() {
    var tilt = new Array(6)
    for (var i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0)
    }
    return {tilt}
  }

  render() {
    const dimension = CELL_SIZE * 6
    return (
      <Animated.View style={{opacity: this.state.fadeAnim}}>
        <View style={[styles.container, {width: dimension, height: CELL_SIZE }]}>
          {this.renderTiles()}
        </View>
      </Animated.View>
    )
  }

  renderTiles() {
    var result = []
    for (var row = 0; row < 6; row++) {
        var id = row
        var letter = this.state.numbers[id]
        var tilt = this.state.board.tilt[id].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-360deg']
        })
        var style = {
          left: row * CELL_SIZE + CELL_PADDING,
          top: CELL_SIZE + CELL_PADDING,
          transform: [{perspective: CELL_SIZE * .9},
                       {rotateY: tilt}]
        }
        result.push(this.renderTile(id, style, letter))
    }
    return result
  }

  renderTile(id, style, letter) {
    return (
      <Animated.View key={id} style={[styles.tile, style]}>
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    )
  }

  moveTile(id) {
    // setTimeout(() => { this.setState({ numbers: this.hiddenValue(id) }, this.checkSelection(id)) }, 200);
    var tilt = this.state.board.tilt[id];
    tilt.setValue(0);
    Animated.timing(tilt, {
      toValue: .15,
      duration: 800,
      easing: Easing.spring
    }).start();
  }

  moveTileBack(id) {
    var tilt = this.state.board.tilt[id];
    tilt.setValue(.15);
    Animated.timing(tilt, {
      toValue: 0,
      duration: 400,
      easing: Easing.spring
    }).start();
  }

  spinTile(id) {
    var tilt = this.state.board.tilt[id];
    tilt.setValue(0);
    Animated.timing(tilt, {
      toValue: 1,
      duration: 4000,
      easing: Easing.spring
    }).start();
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: height * .25
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Scheme.color3,
    borderColor: Scheme.color5,
    borderWidth: 3
  },
  letter: {
    color: Scheme.color2,
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
    fontFamily: 'American Typewriter'
  },
});

export default Logo;
