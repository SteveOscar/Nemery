import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
const SIZE = 3; // four-by-four grid
const CELL_SIZE = Math.floor(width * .2); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .05); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 1;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = Math.floor(TILE_SIZE * .75);

class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.makeBoard(),
      layer: 0,
      letters: ''
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.initialTileRender(0)
      this.initialTileRender(1)
      this.initialTileRender(2)
    }, 500);
    setTimeout(() => {
      this.initialTileRender(3)
      this.initialTileRender(4)
      this.initialTileRender(5)
    }, 1000);
    setTimeout(() => {
      this.initialTileRender(6)
      this.initialTileRender(7)
      this.initialTileRender(8)
    }, 1500);
  }

  initialTileRender(id) {
    var tilt = this.state.board.tilt[id];
    tilt.setValue(1);
    Animated.timing(tilt, {
      toValue: 0,
      duration: 900,
      easing: Easing.spring
    }).start(this.showLetter(id));
  }

  showLetter(id) {
    setTimeout(() => {
      this.setState({ letters: this.makeSomeLetters(id) })
    }, 500);
  }

  makeSomeLetters(id) {
    let letters = this.state.letters || new Array(SIZE * SIZE)
    letters[id] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
    // letters[i] = ''
    // letters[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0
    return letters
  }

  makeLetters() {
    let letters = new Array(SIZE * SIZE)
    for (var i = 0; i < SIZE * SIZE; i++) {
      letters[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
      // letters[i] = ''
      // letters[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0
    }
    return letters

  }

  makeBoard() {
    var tilt = new Array(SIZE * SIZE)
    for (var i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0)
    }
    return {tilt}
  }

  render() {
    return <View style={styles.container}>
            {this.renderTiles()}
           </View>
  }

  secondaryLetter(id) {
    let { letters } = this.state
    const toMutate = letters[id]
    let mutated = (toMutate.charCodeAt(0) + 2) % 91
    mutated = mutated < 65 ? mutated + 65 : mutated
    newLetter = String.fromCharCode(mutated)
    letters[id] = newLetter
    return letters
  }

  renderTiles() {
    var result = []
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < SIZE; col++) {
        var id = row * SIZE + col
        // var letter = String.fromCharCode(65 + id)
        var letter = this.state.letters[id]
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

  clickTile(id) {
    this.setState({ layer: this.state.layer == 0 ? 1 : 0,
                    letters: this.secondaryLetter(id)
                   })
    var tilt = this.state.board.tilt[id];
    tilt.setValue(1);
    Animated.timing(tilt, {
      toValue: 0,
      duration: 400,
      easing: Easing.spring
    }).start();
  }
}

var styles = StyleSheet.create({
  container: {
    width: CELL_SIZE * SIZE,
    height: CELL_SIZE * SIZE,
    backgroundColor: 'transparent',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BEE1D2',
  },
  letter: {
    color: '#333',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
  },
});

export default BoardView;
