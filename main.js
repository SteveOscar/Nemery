'use strict';

import React from 'react';
import GameView from './GameView.js'
import Menu from './Menu.js'

import {
    Text,
    View,
    StyleSheet,
    Vibration
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

var Main = React.createClass({
  getInitialState: function() {
    return {
      txt: '',
      difficulty: 'Easy',
      level: 1,
      score: 0,
      playing: false,
      Message: 'Hi'
    };
  },

  startGame() {
    this.setState({ playing: true, txt: this.showScore()  })
  },

  highScores() {
    console.log('build it')
  },

  endGame() {
    this.setState({ playing: false, score: 0, txt: 'Score: 0', message: '' })
  },

  showScore() {
    return "Score: " + this.state.score
  },

  upDifficulty() {
    let newDiff
    if(this.state.difficulty === 'Easy'){
      newDiff = 'Medium'
    }else if (this.state.difficulty === 'Medium') {
      newDiff = 'Hard'
    }else {
      newDiff = 'Easy'
    }
    this.setState({ difficulty: newDiff })
  },

  updateScore(tilesTurned) {
    const currentScore = this.state.score
    this.setState({ score: currentScore + 1, txt: "Score " + this.state.score })
    const win = this.checkForWin(tilesTurned)
    if(win) {
      Vibration.vibrate()
      this.setState({ message: 'WIN' })
      setTimeout(() => {
        this.setState({ level: this.state.level + 1, playing: false })
      }, 500)
      setTimeout(() => {
        this.setState({ message: '' })
      }, 1500)
    }
  },

  checkForWin(num) {
    const { difficulty } = this.state
    if(difficulty === "Easy") { return num === 4 }
    if(difficulty === "Medium") { return num === 9 }
    if(difficulty === "Hard") { return num === 16 }
  },

  showMessage(didWin) {
    Vibration.vibrate()
    if(!didWin) { this.setState({ message: 'LOST' }) }
    if(didWin) { this.setState({ message: 'WIN' }) }
  },

  render() {
    const gameBoard = <GameView difficulty={this.state.difficulty}
                                updateScore={this.updateScore}
                                endGame={this.endGame}
                                deliverVerdict={this.showMessage}
                                size={["Easy", "Medium", "Hard"].indexOf(this.state.difficulty) + 2}
                                level={this.state.level}
                      />
    const menu = <Menu startGame={this.startGame}
                       highScores={this.highScores}
                       difficulty={this.state.difficulty}
                       upDifficulty={this.upDifficulty}
                       />
    let component = this.state.playing ? gameBoard : menu
    return <View style={styles.container}>
             {component}
             <View style={styles.textContainer}>
               <Text style={styles.message}>{this.state.message}</Text>
               <Text style={styles.text}>{this.state.txt}</Text>
             </View>
           </View>
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  textContainer: {
    position: 'absolute',
    width: width,
    bottom: height/10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  text: {
    fontSize: 20,
    color: 'white'
  },
  message: {
    fontSize: 40,
    color: 'red'
  }
});

module.exports = Main;
