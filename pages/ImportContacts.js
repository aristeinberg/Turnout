import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Random from 'expo-random';

import Contact, { ContactsContext, ContactSources } from '../contacts';
import { styles } from '../components/SharedStyles';
import { ListButton, sleep } from '../components/Common';
import { EmbedFacebook } from '../components/FacebookView';

function SaveCancelButtons(props) {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={props.onSave} style={[styles.button, styles.large]}>
        <Text style={styles.large}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onCancel} style={[styles.button, styles.large]}>
        <Text style={styles.large}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ImportContacts({route}) {
  const { addToContacts, clearContacts } = useContext(ContactsContext);
  const [ expandSingleContact, setExpandSingleContact ] = useState(false);
  const [ expandFacebook, setExpandFacebook ] = useState(false);
  const [ contactName, setContactName ] = useState('');
  const navigation = useNavigation();

  function importAddressBook() {
    console.log('importing contacts')
    // use replace instead of navigate so when you finish importing it goes
    // straight home
    navigation.replace("Import from Address Book");
  }
  function clearContactsAndGoBack() {
    clearContacts();
    navigation.navigate("Your Contacts");
  }
  async function saveSingleContact() {
    // TODO: wanted to use uuid but apparently it doesn't work in expo?
    // hopefully this will be good enough...
    let id = String(Random.getRandomBytes(8));
    let contact = new Contact(id, contactName, ContactSources.MANUAL);
    contact.addDataFromAddressBook(await contact.lookupInAddressBook());
    console.log('adding contact', id, contact)
    addToContacts(contact);
    setContactName('');
    await sleep(250); // hack - make sure the person can save before navigating to their details
    navigation.navigate("Person Details", {contactId: id});
  }

  const facebookUrl = 'https://m.facebook.com/search/top/?q=friends%20who%20live%20in%20pennsylvania&ref=content_filter&source=typeahead'
  async function addFbContact(data) {
    console.log('message', data);
    const [command, url, name] = data.split('||');
    let contact = new Contact(url, name, ContactSources.FACEBOOK, { socialUrl: url });
    alert('Adding contact: ' + name);
    contact.addDataFromAddressBook(await contact.lookupInAddressBook());
    addToContacts(contact);
  }

  const loggedInText = 
    "Navigate to someone's Facebook profile to have it get added " +
    "to your list automatically.";

  const loggedOutText = 
    "Log into Facebook to see your friends who live in Pennsylvania. " +
    "Then navigate to someone's Facebook profile to have it get added " +
    "to your list automatically.";

  return (
    <View style={styles.container} keyboardShouldPersistTaps='handled'>
      <ListButton onPress={importAddressBook} text='Load contacts from phone' />
      <ListButton onPress={() => setExpandSingleContact(true)} text='Add a single contact' />
      { expandSingleContact &&
        <View style={{padding: 10}}>
          <TextInput style={{ marginHorizontal: 10, borderColor: 'black', borderBottomWidth: 1, height: 40 }}
                autoFocus={true} autoCorrect={false}
                onSubmitEditing={saveSingleContact}
                placeholder="Name"
                value={contactName} onChangeText={setContactName} />
          <SaveCancelButtons onSave={saveSingleContact} onCancel={() => setExpandSingleContact(false)} />
        </View>
      }
      <ListButton onPress={() => setExpandFacebook(!expandFacebook)} style={styles.buttonRow}
                  text='Add from Facebook' />
      { expandFacebook &&
        <EmbedFacebook url={facebookUrl} 
          onMessage={addFbContact}
          onPageLoad={
            (ref) => ref.injectJavaScript(
              `(function() {
                 if (document.querySelectorAll('[data-sigil="timeline-cover"]').length == 1) {
                   window.ReactNativeWebView.postMessage('PROF||' + window.location.href + '||' + 
                     document.querySelectorAll('[data-sigil="MBackNavBarClick"]')[0].innerText);
                 }
                 return true;
               })();`)
          }
          loggedInText={loggedInText}
          loggedOutText={loggedOutText} />
      }
      <ListButton warn='Are you sure you want to remove your whole contact list?'
                  onPress={clearContactsAndGoBack}
                  text='Clear your saved contacts' />
    </View>
  );
}
