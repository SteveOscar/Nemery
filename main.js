'use strict';

import React from 'react';
import GameView from './GameView.js'
import Menu from './Menu.js'
import Login from './Login.js'
import ScoreBoard from './ScoreBoard.js'
import Transition from './Transition.js'
import quotes from './quotes.js'
import DeviceUUID from "react-native-device-uuid"
var DeviceInfo = require('react-native-device-info');

import {
    Text,
    View,
    StyleSheet,
    Vibration,
    ActivityIndicator,
    AsyncStorage,
    StatusBar
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

var Main = React.createClass({
  getInitialState: function() {
    return {
      txt: '...',
      difficulty: 'Easy',
      level: 1,
      score: 0,
      playing: false,
      isLoading: true,
      message: '...',
      currentUser: '',
      highScores: '',
      showingScores: false,
      showingTransition: false,
      lastScore: 0
    };
  },

  componentDidMount() {
    AsyncStorage.getItem("User").then((user) => {
      if (user !== null && user !== "null"){
        let person = JSON.parse(user)
        const greeting = (person && person.name) ? person.name : ''
        this.setState({isLoading: false, currentUser: person, txt: 'Welcome ' + greeting}, this.getScores())
        console.log(JSON.parse(user))
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
      .catch(error => {
         this.setState({
          isLoading: false,
          currentUser: 'Anonymous',
          txt: 'Offline Mode'
       })
     })
  },

  _handleResponse(response) {
    if(response !== undefined) {
      AsyncStorage.setItem('User', JSON.stringify(response))
      const name = this.state.currentUser.name ? this.state.currentUser.name : ''
      this.setState({isLoading: false, currentUser: response, txt: 'Welcome ' + name}, this.getScores());
    } else {
      this.setState({isLoading: false, txt: 'Login unavailable :(', currentUser: 'Anonymous'});
    }
  },

  scoreFetchCheck(justLoaded) {
    let { lastScore, highScores } = this.state
    if(justLoaded) { return true }
    if(lastScore > highScores.high_scores[4][1]) { return true }
    if(lastScore > highScores.user_score) {
      let scores = highScores
      scores.user_score = lastScore
      this.setState({ highScores: scores })
      AsyncStorage.setItem('highScores', JSON.stringify(scores))
    }
    return false
  },

  getScores(justLoaded = true) {
    let shouldGetScores = this.scoreFetchCheck(justLoaded)
    if(!justLoaded && !shouldGetScores) { return }
    const uuid = DeviceInfo.getUniqueID()
    fetch("http://localhost:3000/scores/" + uuid)
      .then(response => response.json())
      .then((response) => {
        this._handleScoreResponse(response);
      })
      .catch(error => {
        AsyncStorage.getItem("highScores").then((scores) => {
          if (scores !== null){
            this.setState({
             isLoading: false,
             highScores: JSON.parse(scores)
           })
         } else {
           this.setState({
             isLoading: false,
             highScores: []
           })
         }
      })
    })
  },

  _handleScoreResponse(response) {
    if(response === null || response === undefined) {
      AsyncStorage.getItem("highScores").then((scores) => {
        if (scores !== null){ this.setState({ highScores: JSON.parse(scores) }) }
        if (scores === null){ this.setState({ highScores: [] }) }
      })
    } else {
      // Check if the user's highest score is in local storage, and push to remote if so
      const s = AsyncStorage.getItem("highScores")
      debugger
      const score = JSON.parse(s)
      if(score.user_score > this.state.highScores.user_score) { this.saveScore(score.user_score) }

      AsyncStorage.setItem('highScores', JSON.stringify(response))
      this.setState({isLoading: false, highScores: response});
    }
  },

  scoreNotWorthy(points) {
    let { lastScore, highScores } = this.state
    if((points < highScores.high_scores[4][1]) && (points < highScores.user_score)) { return true }
    return false
  },

  saveScore(points) {
    const { currentUser } = this.state
    const uuid = DeviceInfo.getUniqueID()
    if(this.scoreNotWorthy(points)) { return }
    this.setState({ lastScore: points, txt: 'Ya done good' })
    fetch("http://localhost:3000/scores/new/" + uuid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: currentUser.id, score: points })
    }).then((response) => {
      console.log('SCORE SAVED ', response)
      this.getScores(false)
    })
    .catch(error =>
       this.setState({
        isLoading: false,
        txt: 'Offline Mode'
     }))
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
    const random = quotes()
    this.setState({ playing: false, score: 0, txt: random, level: 0, showingTransition: false })
    this.saveScore(this.state.score)
  },

  showScore() {
    const { score } = this.state
    return "Score: " + score
  },

  upDifficulty() {
    let newDiff
    if(this.state.difficulty === 'Easy'){
      newDiff = 'Medium'
    }else if (this.state.difficulty === 'Medium') {
      newDiff = 'Hard'
    }else if (this.state.difficulty === 'Hard') {
      newDiff = 'Extreme'
    }else {
      newDiff = 'Easy'
    }
    this.setState({ difficulty: newDiff })
  },

  updateScore(tilesTurned) {
    const { difficulty } = this.state
    const added = difficulty === 'Extreme' ? 2 : 1
    const currentScore = this.state.score + added
    this.setState({ score: currentScore, txt: "Score " + (this.state.score + added) })
    const win = this.checkForWin(tilesTurned)
    if(win) {
      Vibration.vibrate()
      this.setState({ txt: 'Level Passed' })
      setTimeout(() => {
        this.setState({ level: this.state.level + 1, playing: false, showingTransition: true })
      }, 500)
    }
  },

  continueGame() {
    const currentScore = this.state.score
    this.setState({ txt: 'Score: ' + currentScore, playing: true, showingTransition: false })
  },

  checkForWin(num) {
    const { difficulty } = this.state
    if(difficulty === "Easy") { return num === 4 }
    if(difficulty === "Medium") { return num === 9 }
    if(difficulty === "Hard") { return num === 16 }
    if(difficulty === "Extreme") { return num === 16 }
  },

  showMessage(didWin) {
    Vibration.vibrate()
    if(!didWin) { this.setState({ txt: 'Game Over' }) }
    if(didWin) { this.setState({ txt: 'Next Level' }) }
  },

  levelBonus(points) {
    this.setState({ score: points })
  },

  render() {
    console.log('CURRENT USER :', this.state.currentUser)
    var uuid = DeviceInfo.getUniqueID()
    let boardSize = ["Easy", "Medium", "Hard", "Extreme"].indexOf(this.state.difficulty) + 2
    boardSize = boardSize < 4 ? boardSize : 4
    let { currentUser, highScores, showingScores, showingTransition, playing } = this.state
    const loginScreen = <Login setUser={this.setUser}/>

    const scoreBoard = <ScoreBoard highScores={highScores}
                                   backToMenu={this.backToMenu}
                                   />

    const transitionScreen = <Transition level={this.state.level}
                                         score={this.state.score}
                                         continue={this.continueGame}
                                         quit={this.endGame}
                                         difficulty={this.state.difficulty}
                                         addBonus={this.levelBonus}
                                   />

    const gameBoard = <GameView difficulty={this.state.difficulty}
                                updateScore={this.updateScore}
                                endGame={this.endGame}
                                deliverVerdict={this.showMessage}
                                size={boardSize}
                                level={this.state.level}
                      />
    const menu = <Menu startGame={this.startGame}
                       highScoresPage={this.highScoresPage}
                       difficulty={this.state.difficulty}
                       upDifficulty={this.upDifficulty}
                       />

    let spinner = this.state.isLoading ? (<ActivityIndicator size='large' color='white' style={styles.spinner}/>) : (<View style={{height: 35}} />)
    let component

    if(playing) { component = gameBoard }
    if(!playing && this.state.currentUser) { component = menu }
    if(!playing && !this.state.currentUser) { component = loginScreen }
    if(!currentUser) { component = loginScreen }
    if(currentUser && showingScores) { component = scoreBoard }
    if(showingTransition) { component = transitionScreen }
    if(this.state.isLoading) { component = spinner }
    return <View style={styles.container}>
             {component}
             <View style={styles.messageBox}>
               <StatusBar hidden={true} />
               <Text style={styles.text}>{this.state.txt}</Text>
               {/*<Text style={styles.user}>{currentUser ? 'Good Day , '+ this.state.score : ''}</Text>*/}
             </View>
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
    color: 'white',
    fontFamily: 'American Typewriter'
  },
  messageBox: {
    height: height * .1,
    width: width,
    backgroundColor: '#3c2f2f',
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  user: {
    fontSize: 20,
    color: '#3c2f2f',
    fontFamily: 'American Typewriter',
    paddingTop: height*.1
  }
});

module.exports = Main;
