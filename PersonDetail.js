import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

import Contact from './contacts';

function EmbedSocialMedia(props) {
  const [socialMediaUrl, setSocialMediaUrl] = useState(null);

  props.contact.lookupInAddressBook().then((abContact) => {
    console.log(abContact);
    for (const sp of abContact['socialProfiles']) {
      if (sp['service'] == 'Facebook') {
        setSocialMediaUrl(sp['url'].replace('http:', 'https:').replace('/www.', '/m.') + '/about');
        return;
      }
    }
  });
  const url = socialMediaUrl ||
    'https://www.facebook.com/search/top?q=' + encodeURIComponent(props.contact.name);
  console.log('url is ', url)
  return (
    <View style={{ margin: 10, borderWidth: 1, borderColor: 'gray', flex: 1, flexDirection: 'row' }}>
    <WebView
      source={{ uri: url }}
      sharedCookiesEnabled={true}
      /></View>
  );
}

function PersonDetail(props) {
  const [expandBirthday, setExpandBirthday] = useState(false);

  return (
    <View style={styles.personDetail}>
      <Text style={styles.name}>
        {props.contact.name}
      </Text>
      <TouchableOpacity style={styles.editableField} onPress={() => setExpandBirthday(!expandBirthday)}>
        { props.contact.data.birthYear ?
            <Text>{props.contact.getBirthdayStr()}</Text>
          : <Text>Find birthday</Text>
        }
      </TouchableOpacity>
      { expandBirthday && <EmbedSocialMedia contact={props.contact} />}
      <TouchableOpacity style={styles.editableField}>
        { props.contact.data.county ?
            <Text>{props.contact.data.county}</Text>
          : <Text>Find county</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity style={[styles.editableField, styles.disabled]}>
        <Text style={styles.disabled}>Check voting status</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.editableField, styles.warning]}>
        <Text style={styles.warning}>Delete contact</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PersonDetails({route}) {
  const contact = Contact.deserialize(route.params.contact);
  return (
    <PersonDetail contact={contact} />
  );
}

const styles = StyleSheet.create({
  personDetail: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 0,
  },
  name: {
    fontSize: 24,
  },
  editableField: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  disabled: {
    borderColor: 'gray',
    color: 'gray',
  },
  warning: {
    borderColor: 'red',
    color: 'red',
  },
});