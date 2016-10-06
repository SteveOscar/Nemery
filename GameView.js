import React from 'react';
import Sound from 'react-native-sound'

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
const LETTER_SIZE = Math.floor(TILE_SIZE * .70);
const timer = require('react-native-timer');

class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      board: this.makeBoard(),
      prevSelection: '',
      numbers: '',
      hiddenLetters: this.generateNumbers(),
      beenClicked: [],
      size: this.props.size,
      delay: 500,
      inPlay: false,
      progress: new Animated.Value(width),
      timerHeight: new Animated.Value(0)
    }
  }

  playClick() {
    var s = new Sound('click.mp3', Sound.MAIN_BUNDLE, (e) => { s.play() })
  }

  playWhoosh() {
    var s = new Sound('whoosh.mp3', Sound.MAIN_BUNDLE, (e) => { s.play() })
  }

  playWhoosh2(row) {
    if(this.confirmSoundEffect(row)) { var s = new Sound('whoosh2.mp3', Sound.MAIN_BUNDLE, (e) => { s.play() }) }
  }

  confirmSoundEffect(row) {
    const { beenClicked } = this.state
    if(beenClicked.length === 0 ) { return true }

    let rowAdjustment = (row === 1 ? 0 : (row - 1) * this.props.size)
    let clicked = []
    for (var i = 0; i < this.props.size; i++) {
      clicked.push((beenClicked.indexOf(i + rowAdjustment) !== -1))
    }
    let results = [...new Set(clicked)]
    return results.length > 1 || !results[0]
  }

  generateNumbers() {
    const length = this.props.size * this.props.size
    const max = this.props.size * 6
    return randomArray = [...new Array(length)].map((_, i) => Math.round(Math.random() * max + 1));
  }

  timeAdjustment() {
    const { difficulty } = this.props
    if(difficulty === "Easy") { return 1 }
    if(difficulty === "Medium") { return 2 }
    if(difficulty === "Hard") { return 3 }
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 1300
      }
    ).start();
    this.showTiles(true)
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  showTiles(shouldHide) {
    const { delay } = this.state
    const difficultyFactor = this.timeAdjustment()
    setTimeout(() => {
      this.playWhoosh2(1)
      for (var i = 0; i < this.props.size; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 500);
    setTimeout(() => {
      this.playWhoosh2(2)
      for (var i = this.props.size; i < this.props.size*2; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1200);
    setTimeout(() => {
      if(this.props.size < 3) { return }
      this.playWhoosh2(3)
      for (var i = this.props.size*2; i < this.props.size*3; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 1700);
    setTimeout(() => {
      if(this.props.size < 4) { return }
      this.playWhoosh2(4)
      for (var i = this.props.size*3; i < this.props.size*4; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.initialSingleTileShow(i)
        }
      }
    }, 2200);
    if(shouldHide) { this.hideTiles() }
  }

  hideTiles() {
    const difficultyFactor = this.timeAdjustment()
    // shows timer bar first
    setTimeout(() => {
      this.playWhoosh()
      Animated.timing(
        this.state.timerHeight,
        {toValue: 20, duration: 2000}
      ).start();

      for (var i = 0; i < this.props.size; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 2500 * difficultyFactor);
    setTimeout(() => {
      this.playWhoosh()
      for (var i = this.props.size; i < this.props.size*2; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 3200 * difficultyFactor);
    setTimeout(() => {
      if(this.props.size < 3) { return }
      this.playWhoosh()
      for (var i = this.props.size*2; i < this.props.size*3; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 3700 * difficultyFactor);
    setTimeout(() => {
      if(this.props.size < 4) { return }
      this.playWhoosh()
      for (var i = this.props.size*3; i < this.props.size*4; i++) {
        for (var j = 0; j < this.props.size; j++) {
          this.tileHide(i)
        }
      }
    }, 4200 * difficultyFactor);
    setTimeout(() => {
      this.setState({ inPlay: true })
      this.startTimer()
    }, 4500 * difficultyFactor);
  }

  startTimer() {
    Animated.timing(
      this.state.progress,
      {toValue: 0, duration: 4000}
    ).start();
    setTimeout(() => {
      this.handleTimerEnd()
    }, 4000)
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
      this.setState({ numbers: this.makeSomeNumbers(id) })
    }, 500);
  }

  makeSomeNumbers(id) {
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

  render() {
    const dimension = CELL_SIZE * this.props.size
    const time = this.state.progress
    return (
      <View style={{width: width}}>
        <Animated.View style={{opacity: this.state.fadeAnim}}>
          <Animated.View style={{position: 'absolute', left: 0, right: 0, top:-(height*.1), backgroundColor: 'black', height: this.state.timerHeight, width: this.state.progress, borderRadius: 5, opacity: .5}}>
          </Animated.View>
          <View style={{width: dimension, height: dimension, alignSelf: 'center'}}>
            {this.renderTiles()}
          </View>
        </Animated.View>
      </View>
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

  alreadyClicked(id) {
    let { beenClicked } = this.state
    if(beenClicked.indexOf(id) !== -1) { return true }
    beenClicked.push(id)
    this.setState({ beenClicked: beenClicked })
  }

  clickTile(id) {
    if(!this.state.inPlay) { return }
    if(this.alreadyClicked(id)) { return }
    this.playClick()
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
    if(selected >= this.state.prevSelection) {
      this.setState({ prevSelection: selected })
      this.props.updateScore(this.state.numbers.filter((n) => n !== "").length)
    }else {
      this.props.deliverVerdict(false)
      this.setState({ inPlay: false })
      this.showTiles(false)
      this.endGame()
    }
  }

  hiddenValue(id) {
    let { numbers } = this.state
    numbers[id] = this.state.hiddenLetters[id]
    return numbers
  }

  handleTimerEnd() {
    // if(!this.state.inPlay) { return }
    const length = this.props.size * this.props.size
    if(!this.state.inPlay || this.state.beenClicked.length == length) { return }
    this.props.deliverVerdict(false)
    this.setState({ inPlay: false })
    this.showTiles(false)
    this.endGame()
  }

  endGame() {
    setTimeout(() => {
      this.props.endGame()
    }, 3500)
  }

  // showAllTiles() {
  //   this.endGame()
  //   setTimeout(() => {
  //     for (var i = 0; i < this.props.size * this.props.size; i++) {
  //       for (var j = 0; j < this.props.size * this.props.size; j++) {
  //         this.initialSingleTileShow(i)
  //       }
  //     }
  //   }, 500);
  // }
}

var styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4e6',
    borderColor: '#be9b7b',
    borderWidth: 3
  },
  letter: {
    color: '#854442',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
    fontFamily: 'American Typewriter'
  },
  timer: {

  }
});

export default BoardView;
