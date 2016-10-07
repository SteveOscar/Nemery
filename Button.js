import React from 'react';
import Logo from './Logo.js'
import Sound from 'react-native-sound'
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
    var s = new Sound('click.mp3', Sound.MAIN_BUNDLE, (e) => { s.play() })
  }

  handlePress() {
    this.playButton()
    this.props.action()
  }

  render() {
    return (
      <TouchableHighlight style={styles.container} onPress={this.handlePress.bind(this)} underlayColor={'#fff4e6'}>
        <Text style={styles.buttonText} >{this.props.text}</Text>
      </TouchableHighlight>
    )
  }
}
  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.48)',
      borderRadius: 5,
      borderWidth: 0,
      borderColor: '#fff4e6',
      marginBottom: height * .01,
      height: height * .07,
      alignItems:'center',
      justifyContent:'center'
    },
    buttonText: {
      fontSize: height * .045,
      color: 	'#fff4e6',
      fontFamily: 'American Typewriter'
    },
  });
export default Button;
