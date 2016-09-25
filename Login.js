import React from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
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
    ActivityIndicator,
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
    this.refs.scroll.scrollTo({x: 0, y: 100, animated: true})
  }

  textInputBlur() {
    dismissKeyboard()
    this.refs.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  onButtonPressed() {
    if(this.state.isLoading) { return }
    this.setState({ isLoading: true })
    this._executeQuery()
  }

  _executeQuery() {
  const uuid = DeviceInfo.getUniqueID()
  this.setState({isLoading: true});
    fetch("http://localhost:3000/users", {method: "POST", body: JSON.stringify({name: this.state.text, device: uuid})})
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
      console.log(response)
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
          <Text style={styles.buttonText} onPress={this.props.startGame}>Welcome to Numery</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim2}}>
          <Text style={styles.buttonText}>Create a User Name:</Text>
        </Animated.View>
        <Animated.View style={{opacity: this.state.fadeAnim3}}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            autoCorrect={false}
            maxLength={20}
            selectionColor={'tan'}
            keyboardType={'default'}
            onFocus={this.textInputFocused.bind(this)}
            onBlur={this.textInputBlur.bind(this)}
            />
            <TouchableHighlight onPress={this.onButtonPressed.bind(this)}
                      style={styles.button}
                      underlayColor='#99d9f4'>
              <Text style={styles.buttonText2}>Submit</Text>
            </TouchableHighlight>
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
    // flexDirection: 'column',
  },
  scrollContainer: {
    paddingTop: height*.3,
  },
  inputStyle: {
    height: 40,
    borderColor: 'tan',
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
    color: 'white',
    justifyContent: 'center'
  },
  buttonText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 30,
    color: 'tan'
  },
  buttonText2: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 25,
    color: '#644B62'
  },
  button: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: 'tan',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    width: 250,
    alignSelf: 'center'
  },
  spinner: {
  },
  message: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 25,
    color: 'white'
  }
});

export default Login;
