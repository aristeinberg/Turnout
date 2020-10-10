import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import DateTimePicker from '@react-native-community/datetimepicker';

import Contact, { ContactsContext } from './contacts';
import { addExistingContactToGroupAsync } from 'expo-contacts';

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

function Birthday(props) {
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
    <View>{/* need this outer view just to give the whole thing a common parent, otherwise I'd skip it */}
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
        <TouchableOpacity style={styles.button} onPress={toggleBirthday}>
          <Text>
            { expandBirthday ? "Save" :
                                props.contact.data.birthDay ? "Edit" :
                                                              "Find" }
          </Text>
        </TouchableOpacity>
      </View>
      { expandBirthday && <EmbedSocialMedia contact={props.contact} />}
    </View>
  );
}

function County(props) {
  const [expandCounty, setExpandCounty] = useState(false);
  const [county, setCounty] = useState(props.contact.data.county);
  const { updateContact } = useContext(ContactsContext);

  function toggleCounty() {
    if (expandCounty) {
      updateContact(props.contact.id, {
        county : county,
      });
    }
    setExpandCounty(!expandCounty);
  }

  return (
    <View style={styles.personDetailRow}>
      <Text>
        County: { !expandCounty && (props.contact.data.county || "Unknown") }
      </Text>
      { expandCounty && <TextInput style={{borderWidth: 1, borderColor: 'gray', flex: 1 }} value={county} onChangeText={setCounty} /> }
      <TouchableOpacity style={styles.button} onPress={toggleCounty}>
        <Text>{ expandCounty ? "Save" : props.contact.data.county ? "Edit" : "Find" }</Text>
      </TouchableOpacity>
    </View>
  );
}

function PersonDetail(props) {
  return (
    <View style={styles.personDetail}>
      <Text style={styles.name}>
        {props.contact.name}
      </Text>
      <Birthday contact={props.contact} />
      <County contact={props.contact} />
      <View style={styles.personDetailRow}>
        <Text>
          Voting status: { "Unknown" }
        </Text>
        <TouchableOpacity style={[styles.button, styles.disabled]}>
          <Text>{ false ? "Update" : "Check" }</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.warning]}>
        <Text style={styles.warning}>Delete contact</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PersonDetails({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

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
  button: {
    marginLeft: 10,
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