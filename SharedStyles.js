import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  personDetail: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  personDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  disabled: {
    borderColor: 'gray',
    color: 'gray',
  },
  warning: {
    borderColor: 'red',
    color: 'red',
  },
  webview: {
    borderWidth: 2,
    borderColor: 'gray',
    flexDirection: 'row',
    height: 400,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  large: {
    fontSize: 20,
    margin: 5,
  }
});