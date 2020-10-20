import * as Amplitude from 'expo-analytics-amplitude';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';

import Contact, { ContactsContext } from './contacts';
import ImportContacts from './pages/ImportContacts';
import ImportAddressBook from './pages/ImportAddressBook';
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
    if (__DEV__) {
      Amplitude.initialize('e7f3f95efb0bca7a310f9cd2d253449a');
    } else {
      Amplitude.initialize('73614b74fd0c321cbbb7f05db8a92a1e');
    }
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
    const logProperties = {
      field: Object.keys(data)[0],
    };
    if ('voteStatus' in data) {
      logProperties['voteStatus'] = data['voteStatus'];
    }
    Amplitude.logEventWithProperties('UPDATE_CONTACT', logProperties);
    const newContact = Contact.deserialize(contacts[id].serialize()); // deep copy
    Object.assign(newContact.data, data);
    newContact.data.modified = new Date();
    const newContacts = {...contacts};
    newContacts[id] = newContact;
    setContacts(newContacts);
  }

  function addToContacts(newContact) {
    Amplitude.logEventWithProperties('ADD_CONTACT', {
      source: newContact.source
    });
    Amplitude.setUserProperties({
      numContacts: Object.keys(contacts).length + 1
    });
    setContacts({
      ...contacts,
      [newContact.id]: newContact
    });
  }

  function removeContact(id) {
    const newContacts = {...contacts};
    delete newContacts[id];
    setContacts(newContacts);
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
      removeContact: removeContact,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Your Contacts"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#55dff1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} >
          <Stack.Screen name="Your Contacts" component={PersonList} />
          <Stack.Screen name="Import Contacts" component={ImportContacts} />
          <Stack.Screen name="Import from Address Book" component={ImportAddressBook} />
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

