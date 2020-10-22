import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, FlatList, Platform } from 'react-native';

// ideally should calculate this dynamically. on android for some reason it
// fluctuates between 40.0 and 40.4 in height
const LIST_BUTTON_HEIGHT = Platform.OS == 'ios' ? 38 : 40.2;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ListButton(props) {
  function onPress(event) {
    if (props.warn) {
      Alert.alert("Confirmation", props.warn, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: () => props.onPress(event) },
      ]);
    } else {
      return props.onPress(event);
    }
  }
  return (
    <TouchableOpacity style={[styles.listButton, props.selected && {backgroundColor: '#007aff'}]} onPress={onPress}>
      <View style={styles.listButtonRow}>
        <View style={styles.listButtonContent}>
        { props.text ?
          <Text style={[styles.listButtonText,
                        props.warn && styles.listButtonWarnText,
                        props.selected && {color: 'white'}]}>{props.text}</Text>
          : props.children
        }
        </View>
        <View style={styles.listButtonArrow}>
          { props.buttonContents ||
            <Text style={styles.listButtonArrowText}>
              { props.buttonText || '>'}
            </Text>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function SaveButtonRow(props) {
  return (
    <View style={{ flexDirection: 'row'}}>
      <View style={{flex: 1}} />
      <TouchableOpacity style={styles.saveButton} onPress={props.onPress}>
        <Text>Save</Text>
      </TouchableOpacity>
      <View style={{flex: 1}} />
    </View>
  );
}

export function Typeahead(props) {
  const [searchText, setSearchText] = useState(props.defaultText);
  function match(item) {
    if (!searchText) return true;
    return (item.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
  }

  const index = Object.fromEntries(props.data.map((v, i) => [v, i]));

  return (
    <View style={props.style}>
      <TextInput style={{ marginHorizontal: 10, borderColor: 'black', borderBottomWidth: 1, height: 40 }}
            autoCorrect={false}
            placeholder={props.placeholder}
            value={searchText} onChangeText={setSearchText} />
      <FlatList 
        data={props.data.filter(match)}
        initialScrollIndex={index[props.value]}
        getItemLayout={(data, index) => (
          {length: LIST_BUTTON_HEIGHT,
           offset: LIST_BUTTON_HEIGHT*index,
           index: index}) }
        ref={(r) => props.fRef && props.fRef(r)}
        renderItem={({item}) => (
          <ListButton 
            selected={(props.value === item)}
            buttonText=' '
            onPress={() => { props.onValueChange(item)}}>
            <View style={{ flexDirection: 'row', width: 500 }}>
              {/* TODO: highlight matching substring */}
              <Text style={(props.value === item) && {color: 'white'}}>
                {item}
              </Text>
            </View>
          </ListButton>
        )}
        keyExtractor={(item) => item }
      />
    </View>
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

  saveButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
  },
});