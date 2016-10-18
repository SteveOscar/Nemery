import React from 'react';
import Logo from './Logo.js'
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

class Button extends React.Component {

  playButton() {
    if(!this.props.sound) { return }
    var s = new Sound('button.mp3', Sound.MAIN_BUNDLE, (e) => {
      s.setVolume(.4)
      s.play()
    })
  }

  handlePress() {
    this.playButton()
    this.props.action()
  }

  render() {
    return (
      <TouchableHighlight style={styles.container} onPress={this.handlePress.bind(this)} underlayColor={Scheme.color1}>
        <Text style={styles.buttonText} >{this.props.text}</Text>
      </TouchableHighlight>
    )
  }
}
  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Scheme.color5,
      borderRadius: 5,
      borderWidth: 0,
      borderColor: Scheme.color3,
      marginBottom: height * .01,
      height: height * .07,
      alignItems:'center',
      justifyContent:'center'
    },
    buttonText: {
      fontSize: height * .045,
      color: Scheme.color2,
      fontFamily: 'American Typewriter'
    },
  });
export default Button;
