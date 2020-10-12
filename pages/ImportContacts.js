import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';

import Contact, { ContactsContext } from '../contacts';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

export default function ImportContacts({route}) {
  const { contacts, addToContacts, clearContacts } = useContext(ContactsContext);
  const navigation = useNavigation();

  async function importContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Birthday,
          Contacts.Fields.SocialProfiles,
          Contacts.Fields.Emails,
        ],
      });

      const filteredContacts = Object.fromEntries(
         data.filter(c => c.phoneNumbers &&
                          c.phoneNumbers.filter(p => p.digits && p.digits.match(PA_NUM_REGEX)).length > 0)
             .map(c => [c.id, Contact.fromAddressBook(c)])
      );

      console.log(filteredContacts);
      addToContacts(filteredContacts);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={importContacts} style={styles.button}>
        <Text style={styles.buttonText}>Import from address book</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearContacts} style={[styles.button, styles.clearButton]}>
        <Text style={{ fontSize: 20, color: '#fff' }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  clearButton: {
    backgroundColor: 'grey'
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  }
});