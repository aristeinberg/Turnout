import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as Contacts from 'expo-contacts';
import * as Random from 'expo-random';

import Contact, { ContactsContext, ContactSources } from '../contacts';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

function SaveCancelButtons(props) {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={props.onSave} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onCancel} style={[styles.button, styles.clearButton]}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ImportContacts({route}) {
  const { contacts, addToContacts, clearContacts } = useContext(ContactsContext);
  const [ expandContactList, setExpandContactList ] = useState(false);
  const [ expandSingleContact, setExpandSingleContact ] = useState(false);
  const [ contactName, setContactName ] = useState('');
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

  function showExpandContactList() {
    console.log('importing contacts')
    importContacts();
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
  async function saveSingleContact() {
    // TODO: wanted to use uuid but apparently it doesn't work in expo?
    // hopefully this will be good enough...
    id = String(Random.getRandomBytes(8));
    console.log('save', id);
    addToContacts({
      [id]: new Contact(id, contactName, ContactSources.MANUAL),
    })
    // TODO:
    // Ideally, we would like to go straight to that person's details page. The
    // problem is, navigation happens before the state gets updated to include
    // the new contact and so this crashes.
    //navigation.navigate("Person Details", {contactId: id});
    navigation.navigate("Your Contacts");
  }

  const [ expandFacebook, setExpandFacebook ] = useState(false);
  let fbRef = null; // this will point to the fb webview
  //const facebookUrl = 'https://m.facebook.com/search/top/?q=friends%20who%20live%20in%20pennsylvania&ref=content_filter&source=typeahead'
  const facebookUrl = 'https://m.facebook.com/';
  async function handleFbNavStateChange(newNavState) {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    // wait a couple of seconds to make sure the page has loaded
    await sleep(2000);
    
    const {url, title, data} = newNavState;
    const [command, url2, name] = (data || '').split('||');
    console.log('callback', command, url, url2, name);
    if (command == 'PROF') {
      addToContacts({
        [url]: new Contact(url2, name, ContactSources.FACEBOOK),
      });
      console.log('Added contact: ', url, url2, name);
      alert('Added contact: ' + name);
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
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={showExpandContactList} style={styles.button}>
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
          <SaveCancelButtons onSave={saveAddressImport} onCancel={cancelAddressImport} />
        </View>
      }
      <TouchableOpacity onPress={() => setExpandSingleContact(true)} style={styles.button}>
        <Text style={styles.buttonText}>Add a single contact</Text>
      </TouchableOpacity>
      { expandSingleContact &&
        <View>
          <TextInput style={{ marginHorizontal: 10, borderColor: 'black', borderBottomWidth: 1, height: 40 }}
                value={contactName} onChangeText={setContactName} />
          <SaveCancelButtons onSave={saveSingleContact} onCancel={() => setExpandSingleContact(false)} />
        </View>
      }
      <TouchableOpacity onPress={() => setExpandFacebook(!expandFacebook)} style={styles.button}>
        <Text style={styles.buttonText}>Add from Facebook</Text>
      </TouchableOpacity>
      { expandFacebook &&
        <View>
          <View style={styles.webview}>
            <WebView style={{flex: 0, height: 400}}
                     automaticallyAdjustContentInsets={false}
                     ref={ref => (fbRef = ref)}
                     source={{ uri: facebookUrl }}
                     sharedCookiesEnabled={true}
                     onMessage={(event) => handleFbNavStateChange(event.nativeEvent)}
                     onNavigationStateChange={handleFbNavStateChange}
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
      <TouchableOpacity onPress={clearContactsAndGoBack} style={[styles.button, styles.clearButton]}>
        <Text style={styles.buttonText}>Clear your saved contacts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webview: {
    borderWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    height: 400,
  },
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