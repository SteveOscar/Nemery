'use strict';

import React from 'react';
import GameView from './GameView.js'
import Menu from './Menu.js'
import Login from './Login.js'
import ScoreBoard from './ScoreBoard.js'
import DeviceUUID from "react-native-device-uuid"
// var Device = require('react-native-device')
var DeviceInfo = require('react-native-device-info');

import {
    Text,
    View,
    StyleSheet,
    Vibration,
    ActivityIndicator,
    AsyncStorage
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
      isLoading: true,
      Message: 'Hi',
      currentUser: '',
      highScores: '',
      showingScores: false
    };
  },

  componentDidMount() {
    AsyncStorage.getItem("User").then((user) => {
      if (user !== null){
        this.setState({isLoading: false, currentUser: JSON.parse(user)}, this.getScores())
      }else {
        this.checkForUser()
      }
    }).done();
  },

  checkForUser() {
    const uuid = DeviceInfo.getUniqueID()
    fetch("http://localhost:3000/users/" + uuid)
      .then(response => response.json())
      .then((response) => {
        this._handleResponse(response);
      })
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  },

  _handleResponse(response) {
    if(response !== undefined) {
      if(response === null) {
        this.setState({isLoading: false})
      }else {
        AsyncStorage.setItem('User', JSON.stringify(response))
        this.setState({isLoading: false, currentUser: response}, this.getScores());
      }
    } else {
      this.setState({isLoading: false, message: 'Server Error'});
    }
  },

  getScores() {
    const uuid = DeviceInfo.getUniqueID()
    fetch("http://localhost:3000/scores/" + uuid)
      .then(response => response.json())
      .then((response) => {
        this._handleScoreResponse(response);
      })
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  },

  _handleScoreResponse(response) {
    if(response !== undefined) {
      if(response === null) {
        this.setState({highScores: ''})
      }else {
        console.log('SCORES ', response)
        this.setState({isLoading: false, highScores: response});
      }
    } else {
      this.setState({isLoading: false, message: 'Server Error'});
    }
  },

  setUser(response) {
    this.setState({ currentUser: response })
  },

  startGame() {
    this.setState({ playing: true, txt: this.showScore()  })
  },

  highScoresPage() {
    this.setState({ showingScores: true })
  },

  backToMenu() {
    this.setState({ showingScores: false })
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
    var uuid = DeviceInfo.getUniqueID()
    let { currentUser, highScores, showingScores } = this.state
    const loginScreen = <Login setUser={this.setUser}/>

    const scoreBoard = <ScoreBoard highScores={highScores}
                                   backToMenu={this.backToMenu}
                                   />

    const gameBoard = <GameView difficulty={this.state.difficulty}
                                updateScore={this.updateScore}
                                endGame={this.endGame}
                                deliverVerdict={this.showMessage}
                                size={["Easy", "Medium", "Hard"].indexOf(this.state.difficulty) + 2}
                                level={this.state.level}
                      />
    const menu = <Menu startGame={this.startGame}
                       highScoresPage={this.highScoresPage}
                       difficulty={this.state.difficulty}
                       upDifficulty={this.upDifficulty}
                       />

    let spinner = this.state.isLoading ? (<ActivityIndicator size='large' color='white' style={styles.spinner}/>) : (<View style={{height: 35}} />)
    let component
    if(this.state.playing) { component = gameBoard }
    if(!this.state.playing && this.state.currentUser) { component = menu }
    if(!this.state.playing && !this.state.currentUser) { component = loginScreen }
    if(!currentUser) { component = loginScreen }
    if(currentUser && showingScores) { component = scoreBoard }
    if(this.state.isLoading) { component = spinner }
    // let component = this.state.playing ? gameBoard : (this.state.currentUser ? menu : loginScreen)

    // if(!currentUser) { let component = loginScreen }
    // let component = scoreBoard
    return <View style={styles.container}>
             {component}
              <Text style={styles.message}>{this.state.message}</Text>
              {/*<Text style={styles.user}>{currentUser ? 'Good Day, '+ currentUser.name : ''}</Text>*/}
           </View>
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#854442',
  },
  text: {
    fontSize: 20,
    color: 'white'
  },
  message: {
    fontSize: 40,
    color: '#3c2f2f',
    fontFamily: 'American Typewriter'
  },
  user: {
    fontSize: 20,
    color: '#3c2f2f',
    fontFamily: 'American Typewriter',
    paddingTop: height*.1
  }
});

module.exports = Main;

// original background: #854442
// original text:
