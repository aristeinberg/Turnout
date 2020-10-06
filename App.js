import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';

import Person from './Person';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

export default function App() {
  const [contacts, setContacts] = useState([]);

  function addContact(contact) {
    setContacts([...contacts, contact]);
  }

  async function importContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const filteredContacts =
         data.filter(c => c.phoneNumbers &&
                          c.phoneNumbers.filter(p => p.digits.match(PA_NUM_REGEX)).length > 0);

      console.log(filteredContacts);
      setContacts(
        [...contacts,
         ...filteredContacts]
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Your contacts
        </Text>
        <TouchableOpacity
          onPress={importContacts}
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Import</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setContacts([])}
          style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList style={styles.list}
                data={contacts}
                renderItem={({item}) => <Person name={item.name} birthday="01/01/1974" county="Montgomery" />}
                keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    color: '#888',
    fontSize: 24,
    marginHorizontal: 15,
  },
  list: {
  },
});
