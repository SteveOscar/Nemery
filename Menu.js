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
      fadeAnim5: new Animated.Value(0),
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
        duration: 700
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim2,
      {
        toValue: 1,
        duration: 600,
        delay: 250
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim3,
      {
        toValue: 1,
        duration: 500,
        delay: 500
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim4,
      {
        toValue: 1,
        duration: 400,
        delay: 650
      }
    ).start();
    Animated.timing(
      this.state.fadeAnim5,
      {
        toValue: 1,
        duration: 300,
        delay: 750
      }
    ).start();
    this.spin()
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
    if(helpText === "Turn") { newText = "Tiles" }
    if(helpText === "Tiles") { newText = "Over" }
    if(helpText === "Over") { newText = "In" }
    if(helpText === "In") { newText = "Order" }
    if(helpText === "Order") { newText = "\uD83D\uDC4C" }
    if(helpText === "\uD83D\uDC4C") { newText = "??" }
    if(helpText === "??") { newText = "Don't" }
    if(helpText === "Don't") { newText = "Make" }
    if(helpText === "Make") { newText = "Me" }
    if(helpText === "Me") { newText = "Repeat" }
    if(helpText === "Repeat") { newText = "Myself" }
    if(helpText === "Myself") { newText = "" }
    if(helpText === "") { newText = "..." }
    if(helpText === "...") { newText = "Okay..." }
    if(helpText === "Okay...") { newText = "???" }
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
          {/*<Animated.Image
            style={{
              width: 50,
              height: 50,
              opacity: .7,
              transform: [{rotate: spin}] }}
              source={require('./gear.png')}
          />*/}
          <Animated.Text style={{
            color: Scheme.color1,
            fontSize: width * .3,
            fontFamily: 'American Typewriter',
            opacity: .9,
            transform: [{rotate: spin}] }}>?</Animated.Text>
        </View>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    let howHard = this.renderDifficulty()
    let { helpText } = this.state
    let { sound } = this.props
    let soundSetting = sound ? 'ON' : 'OFF'

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.fadeAnim1}} >
          <Logo />
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim1}} >
          <Button sound={sound} action={this.props.startGame} text={'HACKED'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Button sound={sound} action={this.props.upDifficulty} text={'Difficulty: ' + howHard}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <Button sound={sound} action={this.props.highScoresPage} text={'High Scores'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim4}}>
          <Button sound={sound} action={this.renderHelp.bind(this)} text={this.state.helpText}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim5}}>
          <Button sound={!sound} action={this.props.setSound} text={'Sound: ' + soundSetting}/>
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
