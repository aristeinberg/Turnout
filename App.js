import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';
import * as Contacts from 'expo-contacts';

import Contact, { ContactsContext } from './contacts';
import PersonDetails from './PersonDetail';
import PersonList from './PersonList';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

const Stack = createStackNavigator();

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

      const filteredContacts = Object.fromEntries(
         data.filter(c => c.phoneNumbers &&
                          c.phoneNumbers.filter(p => p.digits && p.digits.match(PA_NUM_REGEX)).length > 0)
             .map(c => [c.id, Contact.fromAddressBook(c)])
      );

      console.log(filteredContacts);
      setContacts(
        {...contacts,
         ...filteredContacts}
      );
    }
  }

  return (
    <ContactsContext.Provider value={{
      contacts: contacts,
      importContacts: importContacts,
      setContacts: setContacts,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PersonList">
          <Stack.Screen name="PersonList" component={PersonList} />
          <Stack.Screen name="PersonDetails" component={PersonDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactsContext.Provider>
  );

}

