import React from 'react';
import Sound from 'react-native-sound'
import Scheme from './colorScheme.js'

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

  playTap() {
    var s = new Sound('tap.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.7)
      s.play()
    })
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

  maxNumber(difficulty, length) {
    if(difficulty === "Extreme") { return 99 }
    if(difficulty === "Hard") { return 16 }
    if(difficulty === "Medium") { return 9 }
    if(difficulty === "Easy") { return 99 }
    return 29
  }

  generateNumbers() {
    const { size, difficulty } = this.props
    const length = size * size
    const max = this.maxNumber(difficulty, length)
    let random = []
    for (var i = 0; i < length; i++){
      var temp = Math.floor(Math.random()*max);
      if(random.indexOf(temp) == -1){
        random.push(temp);
      } else {
        i--;
      }
    }
    return random
  }

  timeAdjustment() {
    const { difficulty } = this.props
    if(difficulty === "Easy") { return .9 }
    if(difficulty === "Medium") { return 2 }
    if(difficulty === "Hard") { return 3 }
    if(difficulty === "Extreme") { return 2.5 }
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
    const { difficulty } = this.props
    const difficultyFactor = this.timeAdjustment() * 1.2
    const gameDelay = (difficulty === "Easy" || difficulty === "Medium") ? difficultyFactor : difficultyFactor + .2
    // shows timer bar first
    setTimeout(() => {
      this.playWhoosh()
      Animated.timing(
        this.state.timerHeight,
        {toValue: height * .05, duration: 1800}
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
    }, 4000 * gameDelay);
  }

  startTimer() {
    const baseTime = 4000
    const levelFactor = (this.props.level / 10) * baseTime
    const difficultyFactor = this.timeAdjustment() * 1.2
    const timer = (baseTime * difficultyFactor) - levelFactor
    this.playBeep()
    Animated.timing(
      this.state.progress,
      {toValue: 0, duration: timer }
    ).start();
    setTimeout(() => {
      this.handleTimerEnd()
    }, timer)
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
          <Animated.View style={[ styles.timer, { height: this.state.timerHeight, width: this.state.progress}]}>
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
          transform: [{perspective: CELL_SIZE * .95},
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
    this.playTap()
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
      setTimeout(() => { this.playSigh() }, 1500)
      this.playBuzzer()
      this.props.deliverVerdict(false)
      this.setState({ inPlay: false })
      this.showTiles(false)
      this.endGame()
    }
  }

  playSigh() {
    var s = new Sound('exhale.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.3)
      s.play()
    })
  }

  playBuzzer() {
    var s = new Sound('buzzer.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.3)
      s.play()
    })
  }

  playBeep() {
    var s = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.4)
      s.play()
    })
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
    const delay = (this.timeAdjustment()*.8) * 3000
    setTimeout(() => {
      this.props.endGame()
    }, delay)
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
  timer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -(height*.2),
    backgroundColor: Scheme.color3,
    borderRadius: 5,
    opacity: .5,
  }
});

export default BoardView;
