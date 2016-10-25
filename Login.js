import React from 'react'
import Logo from './Logo.js'
import Button from './Button.js'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import Scheme from './colorScheme.js'
const DeviceInfo = require('react-native-device-info');
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Easing,
    TextInput,
    ScrollView,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim1: new Animated.Value(0),
      fadeAnim2: new Animated.Value(0),
      fadeAnim3: new Animated.Value(0),
      text: '',
      isLoading: false,
      message: ''
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
    this.setState({ message: '' })
    this.refs.scroll.scrollTo({x: 0, y: 100, animated: true})
  }

  textInputBlur() {
    dismissKeyboard()
    this.refs.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  onButtonPressed() {
    const overage = this.state.text.length - 10
    if(this.state.text.length === 0) {
      this.setState({ message: 'Enter a name' })
    } else if(overage > 0) {
      const warning = 'Name is ' + overage + ' too long'
      this.setState({ message: warning })
    } else {
      if(this.state.isLoading) { return }
      this.setState({ isLoading: true })
      this._executeQuery()
    }
  }

  _executeQuery() {
  const uuid = DeviceInfo.getUniqueID()
  this.setState({isLoading: true});
    fetch("https://lit-hollows-82917.herokuapp.com/users", {method: "POST", body: JSON.stringify({name: this.state.text, device: uuid})})
      .then(response => response.json())
      .then((response) => {
        this._handleResponse(response);
      })
  }

  _handleResponse(response) {
    if (response !== undefined) {
      this.setState({isLoading: false});
      if(response.errors) {
        this.setState({ message: 'Name already taken' })
      }else {
        this.props.setUser(response)
      }
    } else {
      this.setState({isLoading: false, message: 'Server error'});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    var spinner = this.state.isLoading ? (<ActivityIndicator size='large' color='white' style={styles.spinner}/>) : (<View style={{height: 35}} />)

    return (
      <ScrollView ref='scroll' style={styles.scrollContainer}>
                  {spinner}
        <Animated.View style={{opacity: this.state.fadeAnim1}}>
          <Text style={styles.headerText2} onPress={this.props.startGame}>Welcome to</Text>
          <Logo letters={'NUMERY'}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text style={styles.headerText}>Create a User Name:</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            autoCorrect={false}
            maxLength={20}
            selectionColor={Scheme.color3}
            keyboardType={'default'}
            onFocus={this.textInputFocused.bind(this)}
            onBlur={this.textInputBlur.bind(this)}
            />
            {/*<TouchableHighlight onPress={this.onButtonPressed.bind(this)}
                      style={styles.button}
                      underlayColor='#99d9f4'>
              <Text style={styles.buttonText2}>Submit</Text>
            </TouchableHighlight>*/}
            <Button sound={false} action={this.onButtonPressed.bind(this)} text={'Submit'}/>
        </Animated.View>
        <Text style={styles.message}>{this.state.message}</Text>
      </ScrollView>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    paddingTop: height*.1,
  },
  inputStyle: {
    height: 40,
    borderColor: Scheme.color3,
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
    color: Scheme.color1,
    textAlign:"center",
    marginBottom: 20
  },
  headerText2: {
    fontFamily: 'American Typewriter',
    alignSelf: 'center',
    marginBottom: -10,
    fontSize: height * .045,
    color: Scheme.color5
  },
  headerText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: height * .03,
    color: Scheme.color4
  },
  spinner: {
  },
  message: {
    alignSelf: 'center',
    fontFamily: 'American Typewriter',
    marginTop: height * .025,
    fontSize: height * .035,
    color: Scheme.color5
  }
});

export default Login;
