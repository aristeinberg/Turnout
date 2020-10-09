import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import DateTimePicker from '@react-native-community/datetimepicker';

import Contact, { ContactsContext } from './contacts';

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
      <Text>See if you can find their birthday on Facebook? (Look for "About" =&gt; "Basic Info")</Text>
      <View style={{ borderWidth: 1, borderColor: 'gray', flex: 1, flexDirection: 'row' }}>
        <WebView source={{ uri: url }} sharedCookiesEnabled={true} />
      </View>
    </View>
  );
}

function PersonDetail(props) {
  const [expandBirthday, setExpandBirthday] = useState(false);
  const [selectedDate, setSelectedDate] =
    useState(new Date(props.contact.data.birthYear || 2020,
                      props.contact.data.birthMonth || 0,
                      props.contact.data.birthDay || 1));
  const { updateContact } = useContext(ContactsContext);

  function toggleBirthday() {
    if (expandBirthday) {
      updateContact(props.contact.id, {
        birthYear: selectedDate.getYear(),
        birthMonth: selectedDate.getMonth(),
        birthDay: selectedDate.getDate()
      });
    }
    setExpandBirthday(!expandBirthday);
  }

  return (
    <View style={styles.personDetail}>
      <Text style={styles.name}>
        {props.contact.name}
      </Text>
      <View style={styles.personDetailRow}>
        <View style={{flex: 1}}>
        <Text>
          Birthday: {
            expandBirthday ||
            (props.contact.data.birthYear ? props.contact.getBirthdayStr() : "Unknown")
          }
        </Text>
        { expandBirthday &&
          <DateTimePicker
            mode="date"
            onChange={(event, date) => setSelectedDate(date)}
            value={selectedDate}
          />
        }
        </View>
        <TouchableOpacity style={styles.editableField} onPress={toggleBirthday}>
          <Text>
            { expandBirthday ? "Save" :
                                props.contact.data.birthDay ? "Edit" :
                                                              "Find" }
          </Text>
        </TouchableOpacity>
      </View>
      { expandBirthday && <EmbedSocialMedia contact={props.contact} />}
      <View style={styles.personDetailRow}>
        <Text>
          County: { props.contact.data.county || "Unknown" }
        </Text>
        <TouchableOpacity style={styles.editableField}>
          <Text>{ props.contact.data.county ? "Edit" : "Find" }</Text>
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
    alignItems: 'flex-start',
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