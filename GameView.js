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
const COUNT = SIZE * SIZE
const CELL_SIZE = Math.floor(width * .18); // 20% of the screen width
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
      letters: '',
      hiddenLetters: ['a', 'z', 'e', 'a', 's', 'a', 'f', 's', 'a']
    }
  }

  componentDidMount() {
    setTimeout(() => {
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialTileRender(i)
        }
      }
    }, 500);
    setTimeout(() => {
      for (var i = SIZE; i < SIZE*2; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialTileRender(i)
        }
      }
    }, 1000);
    setTimeout(() => {
      for (var i = SIZE*2; i < SIZE*3; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialTileRender(i)
        }
      }
    }, 1500);
    setTimeout(() => {
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.tileHide(i)
        }
      }
    }, 2300);
    setTimeout(() => {
      for (var i = SIZE; i < SIZE*2; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.tileHide(i)
        }
      }
    }, 2800);
    setTimeout(() => {
      for (var i = SIZE*2; i < SIZE*3; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.tileHide(i)
        }
      }
    }, 3300);
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

  tileHide(id) {
    var tilt = this.state.board.tilt[id];
    tilt.setValue(0);
    Animated.timing(tilt, {
      toValue: 1,
      duration: 900,
      easing: Easing.spring
    }).start(this.hideLetter(id));
  }

  hideLetter(id) {
    setTimeout(() => {
      let letters = this.state.letters
      letters[id] = ''
      this.setState({ letters: letters })
    }, 400);
  }

  showLetter(id) {
    setTimeout(() => {
      this.setState({ letters: this.makeSomeLetters(id) })
    }, 500);
  }

  makeSomeLetters(id) {
    let letters = this.state.letters || new Array(SIZE * SIZE)
    // letters[id] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
    // letters[i] = ''
    // letters[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0
    letters[id] = this.state.hiddenLetters[id]
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
    // const toMutate = letters[id]
    // let mutated = (toMutate.charCodeAt(0) + 2) % 91
    // mutated = mutated < 65 ? mutated + 65 : mutated
    // newLetter = String.fromCharCode(mutated)
    letters[id] = this.state.hiddenLetters[id]
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
    this.setState({ letters: this.secondaryLetter(id) })
    var tilt = this.state.board.tilt[id];
    tilt.setValue(1);
    Animated.timing(tilt, {
      toValue: 4,
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
