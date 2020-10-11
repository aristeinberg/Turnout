import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from './contacts';

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
      <Text>Not sure of their birthday? See if it's listed on Facebook. It'd be in their "About" section under "Basic Info"...</Text>
      <View style={styles.webview}>
        <WebView source={{ uri: url }} sharedCookiesEnabled={true} />
      </View>
    </View>
  );
}

export default function EditBirthday({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [selectedDate, setSelectedDate] =
    useState(new Date(contact.data.birthYear || 2020,
                      contact.data.birthMonth || 0,
                      contact.data.birthDay || 1));

  function save() {
    updateContact(contact.id, {
      birthYear: selectedDate.getYear(),
      birthMonth: selectedDate.getMonth(),
      birthDay: selectedDate.getDate()
    });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
      <DateTimePicker
        mode="date"
        onChange={(event, date) => setSelectedDate(date)}
        value={selectedDate}
      />
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text>Save</Text>
      </TouchableOpacity>
      <EmbedSocialMedia contact={contact} />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  button: {
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});