'use strict';

import React from 'react';
import GameView from './GameView.js'
import Menu from './Menu.js'
import Login from './Login.js'
import ScoreBoard from './ScoreBoard.js'
import Transition from './Transition.js'
import quotes from './quotes.js'
import Scheme from './colorScheme.js'
import Sound from 'react-native-sound'
import DeviceUUID from "react-native-device-uuid"
import codePush from "react-native-code-push"
var DeviceInfo = require('react-native-device-info');

import {
    Text,
    View,
    StyleSheet,
    Vibration,
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    AppState
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
      lastScore: 0,
      localScore: 0,
      sound: true
    };
  },

  componentDidMount() {
    // AppState.addEventListener('change', state =>
    //   codePush.sync()
    //   console.log('SHOULD PUSH!!!!')
    // )
    AppState.addEventListener('change', this._handleAppStateChange)
    codePush.sync()
    AsyncStorage.getItem("highScores").then((s) => {
      if(s) { this.setState({ localScore: (JSON.parse(s)).user_score }) }
    })
    AsyncStorage.getItem("User").then((user) => {
      if (user !== null && user !== "null"){
        let person = JSON.parse(user)
        const greeting = (person && person.name) ? person.name : ''
        this.setState({isLoading: false, currentUser: person, txt: 'Welcome ' + greeting}, this.getScores())
        console.log("USER FOUND LOCALLY ", JSON.parse(user))
      }else {
        this.checkForUser()
      }
    })
  },

  _handleAppStateChange: function(currentAppState) {
    codePush.sync()
    console.log('SHOULD PUSH!!!!')
  },

  checkForUser() {
    const uuid = DeviceInfo.getUniqueID()
    fetch("https://lit-hollows-82917.herokuapp.com/users/" + uuid)
      .then(response => response.json())
      .then((response) => {
        this._handleResponse(response);
      })
      .catch(error => {
         this.setState({
          isLoading: false,
          currentUser: 'Anonymous',
          txt: 'Login unavailable :('
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

  scoreFetchCheck(justLoaded = false) {
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
    fetch("https://lit-hollows-82917.herokuapp.com/scores/" + uuid)
      .then(response => response.json())
      .then((response) => {
        console.log('SCORE RESPONSE!!: ', response)
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
        if (scores === null){ this.setState({ highScores: {high_scores: [], user_score: 0} }) }
      })
    } else {
      if(this.state.localScore > this.state.highScores.user_score) {
        this.saveScore(this.state.localScore)
        let scores = JSON.stringify(response)
        scores.user_score = this.state.localScore
        AsyncStorage.setItem('highScores', scores)
        this.setState({isLoading: false, highScores: scores})
      } else {
        AsyncStorage.setItem('highScores', JSON.stringify(response))
        this.setState({isLoading: false, highScores: response});
      }
    }
  },

  scoreNotWorthy(points) {
    let { lastScore, highScores } = this.state
    if(!highScores.high_scores) { return false }
    if((highScores.high_scores.length > 4) && (points < highScores.high_scores[4][1]) && (points < highScores.user_score)) { return true }
    return false
  },

  saveScore(points) {
    const { currentUser } = this.state
    const uuid = DeviceInfo.getUniqueID()
    if(this.scoreNotWorthy(points)) { return }
    this.setState({ lastScore: points, txt: 'Ya done good' })
    fetch("https://lit-hollows-82917.herokuapp.com/scores/new/" + uuid, {
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
    .catch(error => {
       this.setState({
        isLoading: false,
        txt: 'Score reported'
     })
   })
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

  setSound() {
    const { sound } = this.state
    this.setState({ sound: !sound })
  },

  endGame() {
    const random = quotes()
    this.saveScore(this.state.score)
    this.setState({ playing: false, score: 0, txt: random, level: 1, showingTransition: false })
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
      this.playScream()
      newDiff = 'Extreme'
    }else {
      newDiff = 'Easy'
    }
    this.setState({ difficulty: newDiff })
  },

  updateScore(tilesTurned) {
    const { difficulty } = this.state
    const added = ["Easy", "Medium", "Hard", "Extreme"].indexOf(difficulty) + 1
    const currentScore = this.state.score + added
    this.setState({ score: currentScore, txt: "Score " + (this.state.score + added) })
    const win = this.checkForWin(tilesTurned)
    if(win) {
      setTimeout(() => { this.playBell() }, 500)
      Vibration.vibrate()
      this.setState({ txt: 'Level Passed' })
      setTimeout(() => {
        this.setState({ level: this.state.level + 1, playing: false, showingTransition: true })
      }, 500)
    }
  },

  playBell() {
    if(!this.state.sound) { return }
    let bells = ['bell.mp3', 'bell2.mp3', 'bell3.mp3']
    var s = new Sound(bells[Math.round(Math.random() * 3)], Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.4)
      s.play()
    })
  },

  playScream() {
    if(!this.state.sound) { return }
    var s = new Sound('scream.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.2)
      s.play()
    })
  },

  continueGame() {
    const currentScore = this.state.score
    this.setState({ txt: 'Score: ' + currentScore, playing: true, showingTransition: false })
  },

  checkForWin(num) {
    const { difficulty } = this.state
    if(difficulty === "Easy") { return num === 6 }
    if(difficulty === "Medium") { return num === 9 }
    if(difficulty === "Hard") { return num === 12 }
    if(difficulty === "Extreme") { return num === 16 }
  },

  showMessage(didWin) {
    const overScore = 'Game Over: ' + this.state.score
    Vibration.vibrate()
    if(!didWin) { this.setState({ txt: overScore }) }
    if(didWin) { this.setState({ txt: 'Next Level' }) }
  },

  levelBonus(points) {
    this.setState({ score: points })
  },

  getBoardSize() {
    const index = ["Easy", "Medium", "Hard", "Extreme"].indexOf(this.state.difficulty)
    const sizes = [[3, 2], [3, 3], [4, 3], [4, 4]]
    return sizes[index]
  },

  render() {
    var uuid = DeviceInfo.getUniqueID()
    let boardSize = this.getBoardSize()
    let { currentUser, highScores, showingScores, showingTransition, playing } = this.state
    const loginScreen = <Login setUser={this.setUser}/>

    const scoreBoard = <ScoreBoard highScores={highScores}
                                   backToMenu={this.backToMenu}
                                   sound={this.state.sound}
                                   />

    const transitionScreen = <Transition level={this.state.level}
                                         score={this.state.score}
                                         continue={this.continueGame}
                                         quit={this.endGame}
                                         difficulty={this.state.difficulty}
                                         addBonus={this.levelBonus}
                                         sound={this.state.sound}
                                   />

    const gameBoard = <GameView difficulty={this.state.difficulty}
                                updateScore={this.updateScore}
                                endGame={this.endGame}
                                deliverVerdict={this.showMessage}
                                size={boardSize}
                                level={this.state.level}
                                sound={this.state.sound}
                      />
    const menu = <Menu startGame={this.startGame}
                       highScoresPage={this.highScoresPage}
                       difficulty={this.state.difficulty}
                       upDifficulty={this.upDifficulty}
                       setSound={this.setSound}
                       sound={this.state.sound}
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
    backgroundColor: Scheme.color2,
  },
  text: {
    fontSize: 20,
    color: Scheme.color4,
    fontFamily: 'American Typewriter'
  },
  messageBox: {
    height: height * .1,
    width: width,
    backgroundColor: Scheme.color3,
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
})

module.exports = Main;
