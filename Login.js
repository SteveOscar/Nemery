import React from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
    TextInput,
    ScrollView
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0),
      text: ''
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
  }

  textInputFocused() {
    this.refs.scroll.scrollTo({x: 0, y: 100, animated: true})
  }

  textInputBlur() {
    dismissKeyboard()
    this.refs.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderButtons()}
        </View>
        )
  }

  renderButtons() {
    return (
      <ScrollView ref='scroll' style={styles.scrollContainer}>
        <Animated.View style={{opacity: this.state.fadeAnim1}}>
          <Text style={styles.buttonText} onPress={this.props.startGame}>Welcome to Numery</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text style={styles.buttonText}>Create a User Name:</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <TextInput
            style={{height: 40, borderColor: 'white', borderWidth: 5}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            keyboardType={'default'}
            onFocus={this.textInputFocused.bind(this)}
            onBlur={this.textInputBlur.bind(this)}
            />
        </Animated.View>
      </ScrollView>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    height: height,
    flex: 1,
    // flexDirection: 'column',
  },
  scrollContainer: {
    paddingTop: height*.4,
  },
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: 'tan'
  },
});

export default Login;
