import React from 'react';
import Logo from './Logo.js'
import Button from './Button.js'
import Sound from 'react-native-sound'
import Scheme from './colorScheme.js'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
    LayoutAnimation,
    TouchableHighlight
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0),
      fadeAnim4: new Animated.Value(0),
      spinValue: new Animated.Value(0),
      pressed: false,
      helpText: '???'
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim1,
      {
        toValue: 1,
        duration: 1000
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim2,
      {
        toValue: 1,
        duration: 1000,
        delay: 500
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim3,
      {
        toValue: 1,
        duration: 1000,
        delay: 1000
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim4,
      {
        toValue: 1,
        duration: 1000,
        delay: 1500
      }
    ).start();
    this.spin()
    // this.playButton()
  }

  playButton() {
    var s = new Sound('button.mp3', Sound.MAIN_BUNDLE, (e) => {
        s.play();
    });
  }

  spin () {
    this.state.spinValue.setValue(0)
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 5000,
        easing: Easing.spring
      }
    ).start(() => this.spin())
  }

  handlePress() {
    this.setState({ pressed: true })
    this.spin()
    this.props.highScoresPage()
  }

  renderDifficulty() {
    const { difficulty } = this.props
    if(difficulty === "Easy") { return "\uD83D\uDE00" }
    if(difficulty === "Medium") { return "\uD83D\uDE10" }
    if(difficulty === "Hard") { return "\uD83D\uDE33" }
    if(difficulty === "Extreme") { return "\uD83D\uDC80" }
  }

  renderHelp() {
    const { helpText } = this.state
    newText = helpText
    if(helpText === "???") { newText = "Turn" }
    if(helpText === "Turn") { newText = "Them" }
    if(helpText === "Them") { newText = "Over" }
    if(helpText === "Over") { newText = "In" }
    if(helpText === "In") { newText = "Order" }
    if(helpText === "Order") { newText = "\uD83D\uDC4C" }
    if(helpText === "\uD83D\uDC4C") { newText = "???" }

    this.setState({ helpText: newText })
  }

  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    return (
      <View>
        <View style={styles.spinner}>
          <Animated.Image
            style={{
              width: 50,
              height: 50,
              opacity: .7,
              transform: [{rotate: spin}] }}
              source={require('./gear.png')}
          />
        </View>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    let howHard = this.renderDifficulty()
    let { helpText } = this.state

    return (
      <View style={styles.container}>
        <Logo />
        <Animated.View style={{opacity: this.state.fadeAnim1}} >
          <Button action={this.props.startGame} text={'Start'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Button action={this.props.upDifficulty} text={'Difficulty: ' + howHard}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <Button action={this.props.highScoresPage} text={'High Scores'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim4}}>
          <Button action={this.renderHelp.bind(this)} text={this.state.helpText}/>
        </Animated.View>
      </View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  }
});

export default Menu;
