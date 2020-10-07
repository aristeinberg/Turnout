import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import * as Contacts from 'expo-contacts';

import Contact from './contacts';
import Person from './Person';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

export default function App() {
  const [contacts, _setContacts] = useState([]);
  
  async function loadContacts() {
    try {
      const contacts = Contact.deserializeList(await AsyncStorage.getItem('CONTACTS'));
      if (contacts == null) return;
      _setContacts(contacts);
    } catch (e) {
      console.error('Failed to load contacts', e);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function setContacts(contacts) {
    try {
      await AsyncStorage.setItem('CONTACTS', Contact.serializeList(contacts));
      _setContacts(contacts);
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  }

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

      const filteredContacts = (
         data.filter(c => c.phoneNumbers &&
                          c.phoneNumbers.filter(p => p.digits.match(PA_NUM_REGEX)).length > 0)
             .map(c => Contact.fromAddressBook(c))
      );

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
                renderItem={({item}) => <Person contact={item} />}
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
