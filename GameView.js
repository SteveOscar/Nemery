import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
const SIZE = 2; // four-by-four grid
const COUNT = SIZE * SIZE
const CELL_SIZE = Math.floor(width * .2); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .07); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 1;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = Math.floor(TILE_SIZE * .75);

class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.makeBoard(),
      prevSelection: '',
      numbers: '',
      hiddenLetters: this.generateNumbers(),
      beenClicked: []
    }
  }

  generateNumbers() {
    const length = SIZE * SIZE
    const max = 20
    return randomArray = [...new Array(length)].map((_, i) => Math.round(Math.random() * max));
  }

  componentDidMount() {
    setTimeout(() => {
      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 500);
    setTimeout(() => {
      for (var i = SIZE; i < SIZE*2; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1000);
    setTimeout(() => {
      if(SIZE < 3) { return }
      for (var i = SIZE*2; i < SIZE*3; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1500);
    setTimeout(() => {
      if(SIZE < 4) { return }
      for (var i = SIZE*3; i < SIZE*4; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 2000);
    this.hideTiles()
  }

  hideTiles() {
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
      if(SIZE < 3) { return }
      for (var i = SIZE*2; i < SIZE*3; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.tileHide(i)
        }
      }
    }, 3300);
    setTimeout(() => {
      if(SIZE < 4) { return }
      for (var i = SIZE*3; i < SIZE*4; i++) {
        for (var j = 0; j < SIZE; j++) {
          this.tileHide(i)
        }
      }
    }, 3800);
  }

  initialSingleTileShow(id) {
    // return if tile is already shown
    if(this.state.beenClicked.indexOf(id) !== -1) { return }
    var tilt = this.state.board.tilt[id];
    tilt.setValue(1);
    Animated.timing(tilt, {
      toValue: 0,
      duration: 900,
      easing: Easing.spring
    }).start(this.showNumber(id));
  }

  tileHide(id) {
    var tilt = this.state.board.tilt[id];
    tilt.setValue(0);
    Animated.timing(tilt, {
      toValue: 1,
      duration: 500,
      easing: Easing.spring
    }).start(this.hideNumber(id));
  }

  hideNumber(id) {
    setTimeout(() => {
      let numbers = this.state.numbers
      numbers[id] = ''
      this.setState({ numbers: numbers })
    }, 200);
  }

  showNumber(id) {
    setTimeout(() => {
      this.setState({ numbers: this.makeSomeLetters(id) })
    }, 500);
  }

  makeSomeLetters(id) {
    let numbers = this.state.numbers || new Array(SIZE * SIZE)
    numbers[id] = this.state.hiddenLetters[id]
    return numbers
  }

  makeBoard() {
    var tilt = new Array(SIZE * SIZE)
    for (var i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0)
    }
    return {tilt}
  }

  // makeLetters() {
  //   let numbers = new Array(SIZE * SIZE)
  //   for (var i = 0; i < SIZE * SIZE; i++) {
  //     numbers[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
  //     // numbers[i] = ''
  //     // numbers[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0
  //   }
  //   return numbers
  // }

  render() {
    return <View style={styles.container}>
            {this.renderTiles()}
           </View>
  }

  renderTiles() {
    var result = []
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < SIZE; col++) {
        var id = row * SIZE + col
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

  alreadyClicked(id) {
    let { beenClicked } = this.state
    if(beenClicked.indexOf(id) !== -1) { return true }
    beenClicked.push(id)
    this.setState({ beenClicked: beenClicked })
  }

  clickTile(id) {
    if(this.alreadyClicked(id)) { return }
    setTimeout(() => { this.setState({ numbers: this.hiddenValue(id) }, this.checkSelection(id)) }, 200);
    var tilt = this.state.board.tilt[id];
    tilt.setValue(1);
    Animated.timing(tilt, {
      toValue: 2,
      duration: 300,
      easing: Easing.spring
    }).start();
  }

  checkSelection(id) {
    const selected = this.state.numbers[id]
    if(selected > this.state.prevSelection) {
      this.setState({ prevSelection: selected })
      // continue or finish level
    }else {
      this.showAllTiles()
    }
  }

  hiddenValue(id) {
    let { numbers } = this.state
    numbers[id] = this.state.hiddenLetters[id]
    return numbers
  }

  showAllTiles() {
    setTimeout(() => {
      for (var i = 0; i < SIZE * SIZE; i++) {
        for (var j = 0; j < SIZE * SIZE; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 500);
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
    borderColor: 'white',
    borderWidth: 3
  },
  letter: {
    color: '#644B62',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
  },
});

export default BoardView;

// numbers[id] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
// numbers[i] = ''
// numbers[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0

// const toMutate = numbers[id]
// let mutated = (toMutate.charCodeAt(0) + 2) % 91
// mutated = mutated < 65 ? mutated + 65 : mutated
// newLetter = String.fromCharCode(mutated)
