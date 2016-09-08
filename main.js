'use strict';

import React from 'react';
import GameView from './GameView.js'

import {
    Text,
    View,
    StyleSheet
} from 'react-native';

var {width, height} = require('Dimensions').get('window');

var Main = React.createClass({
  getInitialState: function() {
    return {
      txt: 'Hi State',
      difficulty: 0,
      level: 1,
      playing: true
    };
  },

  render() {
    const gameBoard = <GameView difficulty={this.state.difficulty}
                                level={this.state.level}
                      />
    const menu = <Text style={styles.text}>Menu</Text>
    let component = this.state.playing ? gameBoard : menu
    return <View style={styles.container}>
             {component}
             <View style={styles.textContainer}>
              <Text style={styles.text}>{this.state.txt}</Text>
              </View>
           </View>
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  textContainer: {
    position: 'absolute',
    width: width,
    bottom: height/10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  text: {
    fontSize: 40,
    color: 'white'
  }
});

module.exports = Main;
