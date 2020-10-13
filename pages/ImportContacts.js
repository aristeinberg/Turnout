import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';

import Contact, { ContactsContext } from '../contacts';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

export default function ImportContacts({route}) {
  const { contacts, addToContacts, clearContacts } = useContext(ContactsContext);
  const [ expandContactList, setExpandContactList ] = useState(false);
  const [ addressBook, setAddressBook ] = useState({});
  const [ selectedContacts, setSelectedContacts ] = useState({});
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

      const newEntries = data.filter(c => !(c.id in contacts) && c.name);
      const newAddresses = Object.fromEntries(
         newEntries.map(c => [c.id, Contact.fromAddressBook(c)]));

      const selectedContacts = Object.fromEntries(
        newEntries.filter(c => (
          c.phoneNumbers &&
          c.phoneNumbers.filter(p => p.digits &&
                                     p.digits.match(PA_NUM_REGEX)).length > 0)
        ).map(c => [c.id, true])
      );
      setAddressBook(newAddresses);
      setSelectedContacts(selectedContacts);
    }
  }

  function toggleExpandContactList() {
    if (!expandContactList) {
      console.log('importing contacts')
      importContacts();
    }
    setExpandContactList(true);
  }
  function saveAddressImport() {
    console.log('saving contacts')
    addToContacts(Object.fromEntries(
      Object.keys(selectedContacts).map(id => [id, addressBook[id]])));
    navigation.navigate("Your Contacts");
  }
  function cancelAddressImport() {
    setExpandContactList(false);
  }
  function clearContactsAndGoBack() {
    clearContacts();
    navigation.navigate("Your Contacts");
  }

  function ContactList(props) {
    return (
      <FlatList 
        style={{borderWidth: 1, borderColor: 'black'}}
        data={props.data.sort((a,b) => a.name.localeCompare(b.name))}
        renderItem={({item}) => {
          return (
          <TouchableOpacity 
            onPress={(e) => {
              let newContacts = {...selectedContacts};
              if (props.selected) {
                delete newContacts[item.id];
              } else {
                newContacts[item.id] = true;
              }
              setSelectedContacts(newContacts);
            }}>
            <View style={{ flexDirection: 'row', padding: 5, width: 500 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name.split(' ', 2)[0]}</Text>
              <Text> {item.name.split(' ', 2)[1]}</Text>
            </View>
          </TouchableOpacity>
        )}}
        keyExtractor={(item) => item.id }
      />);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpandContactList} style={styles.button}>
        <Text style={styles.buttonText}>Load contacts from phone</Text>
      </TouchableOpacity>
      { expandContactList &&
        <View>
          <View style={{flexDirection: 'row', height: 400 }}>
            <View style={{flexDirection: 'column', flex: 1, marginRight: 5}}>
              <Text style={{fontWeight: 'bold'}}>Selected:</Text>
              <ContactList selected={true}
                data={Object.keys(selectedContacts).map(id => addressBook[id])} />
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Unselected:</Text>
              {/* todo: remove selected? */}
              {/* todo: figure out how not to reset scroll position when you select one... */}
              <ContactList selected={false}
                data={Object.values(addressBook)} />
            </View>
          </View>
          <Text>(By default, we selected people with PA area codes.)</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={saveAddressImport} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelAddressImport} style={[styles.button, styles.clearButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <TouchableOpacity onPress={clearContactsAndGoBack} style={[styles.button, styles.clearButton]}>
        <Text style={styles.buttonText}>Clear your saved contacts</Text>
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
    backgroundColor: 'grey',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  }
});