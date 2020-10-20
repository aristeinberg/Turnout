import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as Random from 'expo-random';

import Contact, { ContactsContext, ContactSources } from '../contacts';
import { styles } from '../components/SharedStyles';
import { ListButton } from '../components/Common';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

  let fbRef = null; // this will point to the fb webview
  const facebookUrl = 'https://m.facebook.com/search/top/?q=friends%20who%20live%20in%20pennsylvania&ref=content_filter&source=typeahead'
  async function handleFbNavStateChange(newNavState) {
    // wait a couple of seconds to make sure the page has loaded
    await sleep(1000);
    
    const {url, title, data} = newNavState;
    const [command, url2, name] = (data || '').split('||');
    console.log('callback', command, url, url2, name);
    if (command == 'PROF') {
      let contact = new Contact(url2, name, ContactSources.FACEBOOK, {socialUrl: url2});
      alert('Adding contact: ' + name);
      contact.addDataFromAddressBook(await contact.lookupInAddressBook());
      addToContacts(contact);
      return;
    }
    if (url.includes('/search/top/')) {
      fbRef.injectJavaScript(`document.querySelectorAll('[aria-label*="See All"]')[0].click()`);
      return;
    }
    fbRef.injectJavaScript(`(function() {
      if (document.querySelectorAll('[data-sigil="timeline-cover"]').length == 1) {
      window.ReactNativeWebView.postMessage('PROF||' + window.location.href + '||' + 
        document.querySelectorAll('[data-sigil="MBackNavBarClick"]')[0].innerText);
    } else {
      //window.ReactNativeWebView.postMessage('TEST||HI||BYE');
    }
    return true;
  })();`);
  }

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
        <View style={{padding: 10}}>
          <View style={styles.webview}>
            <WebView style={{flex: 0, height: 400}}
                     automaticallyAdjustContentInsets={false}
                     ref={ref => (fbRef = ref)}
                     source={{ uri: facebookUrl }}
                     sharedCookiesEnabled={true}
                     onMessage={(event) => handleFbNavStateChange(event.nativeEvent)}
                     onNavigationStateChange={handleFbNavStateChange}
                     /* 
                      * facebook doesn't trigger full page loads when you
                      * navigate around. hence, need to hack the react webview
                      * to get it to trigger navigation events.
                      * i found the below code here:
                     https://github.com/react-native-webview/react-native-webview/issues/24 */
                     injectedJavaScript={`
                     (function() {
                       function wrap(fn) {
                         return function wrapper() {
                           var res = fn.apply(this, arguments);
                           window.ReactNativeWebView.postMessage('navigationStateChange');
                           return res;
                         }
                       }
                 
                       history.pushState = wrap(history.pushState);
                       history.replaceState = wrap(history.replaceState);
                       window.addEventListener('popstate', function() {
                         window.ReactNativeWebView.postMessage('navigationStateChange');
                       });
                     })();
                     true;
                   `}
            />
          </View>
          <Text>Navigate to a Facebook profile to have it get added to your list.</Text>
        </View>
      }
      <ListButton warn='Are you sure you want to remove your whole contact list?'
                  onPress={clearContactsAndGoBack}
                  text='Clear your saved contacts' />
    </View>
  );
}
