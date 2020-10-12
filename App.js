import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';

import Contact, { ContactsContext } from './contacts';
import ImportContacts from './pages/ImportContacts';
import PersonDetails from './pages/PersonDetail';
import EditBirthday from './pages/EditBirthday';
import EditCounty from './pages/EditCounty';
import CheckVoteStatus from './pages/CheckVoteStatus';
import PersonList from './pages/PersonList';
import ReachOut from './pages/ReachOut';

const Stack = createStackNavigator();

export default function App() {
  const [contacts, _setContacts] = useState({});
  
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

  function addToContacts(newContacts) {
    setContacts({
      ...contacts,
      ...newContacts
    });
  }

  function clearContacts() {
    setContacts({});
  }

  return (
    <ContactsContext.Provider value={{
      contacts: contacts,
      clearContacts: clearContacts,
      addToContacts: addToContacts,
      updateContact: updateContact,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Your Contacts">
          <Stack.Screen name="Your Contacts" component={PersonList} />
          <Stack.Screen name="Import Contacts" component={ImportContacts} />
          <Stack.Screen name="Person Details" component={PersonDetails} />
          <Stack.Screen name="Edit Birthday" component={EditBirthday} />
          <Stack.Screen name="Edit County" component={EditCounty} />
          <Stack.Screen name="Check Vote Status" component={CheckVoteStatus} />
          <Stack.Screen name="Reach Out" component={ReachOut} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactsContext.Provider>
  );

}

