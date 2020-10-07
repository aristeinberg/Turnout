import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

import Contact from './contacts';

function EmbedSocialMedia(props) {
  const [socialMediaUrl, setSocialMediaUrl] = useState(null);

  props.contact.lookupInAddressBook().then((abContact) => {
    console.log(abContact);
    if (!abContact['socialProfiles']) {
      return;
    }
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
    <View style={{ flexDirection: 'column', flex: 1, padding: 5 }}>
      <Text>See if you can find their birthday on Facebook? (Look for "About" => "Basic Info")</Text>
      <View style={{ borderWidth: 1, borderColor: 'gray', flex: 1, flexDirection: 'row' }}>
        <WebView source={{ uri: url }} sharedCookiesEnabled={true} />
      </View>
    </View>
  );
}

function PersonDetail(props) {
  const [expandBirthday, setExpandBirthday] = useState(false);

  return (
    <View style={styles.personDetail}>
      <Text style={styles.name}>
        {props.contact.name}
      </Text>
      <View style={styles.personDetailRow}>
        <Text>
          Birthday: { props.contact.data.birthYear ? props.contact.getBirthdayStr() : "Unknown" }
        </Text>
        <TouchableOpacity style={styles.editableField} onPress={() => setExpandBirthday(!expandBirthday)}>
          <Text>{ props.contact.data.birthMonth ? "Find" : "Edit" }</Text>
        </TouchableOpacity>
      </View>
      { expandBirthday && <EmbedSocialMedia contact={props.contact} />}
      <View style={styles.personDetailRow}>
        <Text>
          County: { props.contact.data.county || "Unknown" }
        </Text>
        <TouchableOpacity style={styles.editableField}>
          <Text>{ props.contact.data.county ? "Find" : "Edit" }</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          Voting status: { "Unknown" }
        </Text>
        <TouchableOpacity style={[styles.editableField, styles.disabled]}>
          <Text>{ false ? "Update" : "Check" }</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    margin: 0,
  },
  personDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
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