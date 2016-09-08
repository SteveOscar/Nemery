'use strict';

import React from 'react';
import GameView from './GameView.js'
import Menu from './Menu.js'

import {
    Text,
    View,
    StyleSheet
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

var Main = React.createClass({
  getInitialState: function() {
    return {
      txt: '',
      difficulty: 'Easy',
      level: 1,
      score: 0,
      playing: false
    };
  },

  startGame() {
    this.setState({ playing: true, txt: this.showScore()  })
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

  updateScore() {
    const currentScore = this.state.score
    this.setState({ score: currentScore + 1, txt: "Score " + this.state.score })
  },

  render() {
    const gameBoard = <GameView difficulty={this.state.difficulty}
                                updateScore={this.updateScore}
                                level={this.state.level}
                      />
    const menu = <Menu startGame={this.startGame}
                       difficulty={this.state.difficulty}
                       upDifficulty={this.upDifficulty}
                       />
    let component = this.state.playing ? gameBoard : menu
    return <View style={styles.container}>
             {component}
             <View style={styles.textContainer}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
});

module.exports = Main;
