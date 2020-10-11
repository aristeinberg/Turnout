import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';
import * as Contacts from 'expo-contacts';

import Contact, { ContactsContext } from './contacts';
import PersonDetails from './pages/PersonDetail';
import EditBirthday from './pages/EditBirthday';
import EditCounty from './pages/EditCounty';
import CheckVoteStatus from './pages/CheckVoteStatus';
import PersonList from './pages/PersonList';

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

  async function updateContact(id, data) {
    const newContact = Contact.deserialize(contacts[id].serialize()); // deep copy
    Object.assign(newContact.data, data);
    newContact.data.modified = new Date();
    const newContacts = {...contacts};
    newContacts[id] = newContact;
    setContacts(newContacts);
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
      updateContact: updateContact,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Person List">
          <Stack.Screen name="Person List" component={PersonList} />
          <Stack.Screen name="Person Details" component={PersonDetails} />
          <Stack.Screen name="Edit Birthday" component={EditBirthday} />
          <Stack.Screen name="Edit County" component={EditCounty} />
          <Stack.Screen name="Check Vote Status" component={CheckVoteStatus} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactsContext.Provider>
  );

}

