import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { call } from 'react-native-reanimated';

import { ContactsContext } from '../contacts';

export default function ReachOut({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  let keyMessage = '';
  switch (contact.data.voteStatus) {
    case 'voted':
      break;
    case 'unknown':
    default:
      keyMessage = "Hey, I noticed you haven't voted yet. Are you going to?";
      break;
  }

  function text() {
    Communications.text(contact.data.phone, keyMessage)
  }
  function call() {
    Communications.call(contact.data.phone);
  }

  return (
    <View style={styles.view}>
      <Text style={styles.instructions} >You should tell { contact.name } something like this: "{ keyMessage }"</Text>
      <TouchableOpacity style={styles.button} onPress={text}>
        <Text>Text them</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={call}>
        <Text>Call them</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
  },
  instructions: {
  },
  button: {
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
});