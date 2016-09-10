import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
// const this.props.size = 2; // four-by-four grid
// const COUNT = this.props.size * this.props.size
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
      beenClicked: [],
      size: this.props.size
    }
  }

  generateNumbers() {
    const length = this.props.size * this.props.size
    const max = 20
    return randomArray = [...new Array(length)].map((_, i) => Math.round(Math.random() * max));
  }

  componentDidMount() {
    this.showTiles(true)
  }

  showTiles(shouldHide) {
    setTimeout(() => {
      for (var i = 0; i < this.props.size; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 500);
    setTimeout(() => {
      for (var i = this.props.size; i < this.props.size*2; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1200);
    setTimeout(() => {
      if(this.props.size < 3) { return }
      for (var i = this.props.size*2; i < this.props.size*3; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1700);
    setTimeout(() => {
      if(this.props.size < 4) { return }
      for (var i = this.props.size*3; i < this.props.size*4; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 2200);
    if(shouldHide) { this.hideTiles() }
  }

  hideTiles() {
    setTimeout(() => {
      for (var i = 0; i < this.props.size; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 2500);
    setTimeout(() => {
      for (var i = this.props.size; i < this.props.size*2; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 3200);
    setTimeout(() => {
      if(this.props.size < 3) { return }
      for (var i = this.props.size*2; i < this.props.size*3; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 3700);
    setTimeout(() => {
      if(this.props.size < 4) { return }
      for (var i = this.props.size*3; i < this.props.size*4; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 4200);
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
    let numbers = this.state.numbers || new Array(this.props.size * this.props.size)
    numbers[id] = this.state.hiddenLetters[id]
    return numbers
  }

  makeBoard() {
    var tilt = new Array(this.props.size * this.props.size)
    for (var i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0)
    }
    return {tilt}
  }

  // makeLetters() {
  //   let numbers = new Array(this.props.size * this.props.size)
  //   for (var i = 0; i < this.props.size * this.props.size; i++) {
  //     numbers[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26)).toUpperCase()
  //     // numbers[i] = ''
  //     // numbers[i] = Math.floor(Math.random() * (10 - 0 + 1)) + 0
  //   }
  //   return numbers
  // }

  render() {
    const dimension = CELL_SIZE * this.props.size
    return <View style={[styles.container, {width: dimension, height: dimension}]}>
            {this.renderTiles()}
           </View>
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
      this.props.updateScore(this.state.numbers.filter((n) => n !== "").length)
    }else {
      this.showTiles(false)
      this.endGame()
    }
  }

  hiddenValue(id) {
    let { numbers } = this.state
    numbers[id] = this.state.hiddenLetters[id]
    return numbers
  }

  showAllTiles() {
    this.endGame()
    setTimeout(() => {
      for (var i = 0; i < this.props.size * this.props.size; i++) {
        for (var j = 0; j < this.props.size * this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 500);
  }

  endGame() {
    setTimeout(() => {
      this.props.endGame()
    }, 3500)
  }

}

var styles = StyleSheet.create({
  container: {
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
