import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  webview: {
    borderWidth: 2,
    borderColor: '#888',
    flexDirection: 'row',
    height: 400,
  },
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f7f7f7',
  },
  large: {
    fontSize: 20,
  },
  intro: {
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    padding: 10,
    flex: 1,
  },
  introLead: {
    color: '#888',
    fontSize: 28,
  },
  introSecondary: {
    color: '#888',
    fontSize: 18,
  },
  link: {
    color: '#55dff1',
    //color: '#007aff',
  },
  personDetails: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listFooter: {
    padding: 10,
    fontStyle: 'italic',
  },
  messagePreview: {
    borderLeftWidth: 1,
    borderColor: '#888',
    paddingLeft: 10,
    margin: 10,
  }
});