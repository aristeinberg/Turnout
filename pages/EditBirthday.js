import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, ContactSources } from '../contacts';
import { styles } from '../components/SharedStyles';
import { SaveButtonRow } from '../components/Common';

function EmbedSocialMedia(props) {
  let defSMUrl = props.contact.data.socialUrl;
  if (defSMUrl && !defSMUrl.includes('?')) {
    defSMUrl += '/about';
  }

  const [socialMediaUrl, setSocialMediaUrl] = useState(defSMUrl);

  const url = socialMediaUrl ||
    'https://www.facebook.com/search/top?q=' + encodeURIComponent(props.contact.name);
  console.log('url is ', url)
  return (
    <View style={{ flexDirection: 'column', flex: 1, padding: 10, backgroundColor: 'white' }}>
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
    <>
      <View style={{backgroundColor: 'white', padding: 10, marginBottom: 20}}>
        <DateTimePicker
          mode="date"
          onChange={(event, date) => setSelectedDate(date)}
          value={selectedDate}
        />
        <SaveButtonRow onPress={save} />
      </View>
      <EmbedSocialMedia contact={contact} />
    </>
  );
}
