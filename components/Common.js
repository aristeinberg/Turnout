import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export function ListButton(props) {
  function onPress(event) {
    if (props.warn) {
      // TODO: ask a question
      Alert.alert("Confirmation", props.warn, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: () => props.onPress(event) },
      ]);
    } else {
      return props.onPress(event);
    }
  }
  // TODO: style warnings with red
  return (
    <TouchableOpacity style={styles.listButton} onPress={onPress}>
      <View style={styles.listButtonRow}>
        <View style={styles.listButtonContent}>
        { props.text ?
          <Text style={[styles.listButtonText, props.warn ? styles.listButtonWarnText : {}]}>{props.text}</Text>
          : props.children
        }
        </View>
        <View style={styles.listButtonArrow}>
          <Text style={styles.listButtonArrowText}>&gt;</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listButton: {
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  listButtonRow:{
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
  },
  listButtonArrow: {
    paddingHorizontal: 10,
  },
  listButtonArrowText: {
    color: '#ddd',
  },
  listButtonWarnText: {
    color: 'red',
  },
  listButtonContent: {
    flex: 1,
    paddingRight: 10,
  },
});