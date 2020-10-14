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
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
  },
  warning: {
    borderColor: 'red',
    color: 'red',
  },
  webview: {
    borderWidth: 2,
    borderColor: '#888',
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
  person: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 10,
  },
  personDetails: {
    flexDirection: 'column',
    paddingRight: 20,
  },
  name: {
    fontSize: 18,
  },
  details: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  listFooter: {
    padding: 10,
    fontStyle: 'italic',
  },
});