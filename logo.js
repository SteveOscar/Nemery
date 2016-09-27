import React from 'react';
const DeviceInfo = require('react-native-device-info');

import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
const CELL_SIZE = Math.floor(width * .2); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .07); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 1;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = Math.floor(TILE_SIZE * .75);

class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.makeBoard(),
      fadeAnim1: new Animated.Value(0),
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
  }

  makeBoard() {
    var tilt = new Array4)
    for (var i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0)
    }
    return {tilt}
  }

  render() {
    const dimension = CELL_SIZE * this.props.size
    return (
      <Animated.View style={{opacity: this.state.fadeAnim}}>
        <View style={[styles.container, {width: dimension, height: dimension}]}>
          {this.renderTiles()}
        </View>
      </Animated.View>
    )
  }

  renderTiles() {
    var result = []
    for (var row = 0; row < this.props.size; row++) {
      for (var col = 0; col < this.props.size; col++) {
        var id = row * this.props.size + col
        var letter = this.state.numbers[id]
        var tilt = this.state.board.tilt[id].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg']
        })
        var style = {
          left: col * CELL_SIZE + CELL_PADDING,
          top: row * CELL_SIZE + CELL_PADDING,
          transform: [{perspective: CELL_SIZE * .9},
                       {rotateX: tilt}]
        }
        result.push(this.renderTile(id, style, letter))
      }
    }
    return result
  }

  renderTile(id, style, letter) {
    return (
      <Animated.View key={id} style={[styles.tile, style]} onStartShouldSetResponder={() => this.clickTile(id)}>
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // flexDirection: 'column',
  },
});

export default Logo;
