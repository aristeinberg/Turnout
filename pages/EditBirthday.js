import React, { useState, useContext } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, ContactSources } from '../contacts';
import { styles } from '../components/SharedStyles';
import { SaveButtonRow } from '../components/Common';
import { EmbedFacebook } from '../components/FacebookView';

function getFbUrl(contact) {
  if (contact.data.socialUrl) {
    if (!contact.data.socialUrl.includes('?')) {
      return contact.data.socialUrl + '/about'
    }
    return contact.data.socialUrl;
  }
  return 'https://m.facebook.com/search/top?q=' + encodeURIComponent(contact.name);
}

export default function EditBirthday({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [selectedDate, setSelectedDate] =
    useState(new Date(contact.getFourDigitBirthYear() || 2020,
                      contact.data.birthMonth || 0,
                      contact.data.birthDay || 1));
  const [showPicker, setShowPicker] = useState(false);

  function save(date) {
    if (!date) return;

    updateContact(contact.id, {
      birthYear: date.getYear(),
      birthMonth: date.getMonth(),
      birthDay: date.getDate()
    });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  const fbText = `Not sure of their birthday? See if it's listed on Facebook. It'd be in their "About" section under "Basic Info."`;

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: 'white', padding: 10}}>
        { Platform.OS == 'ios' ? (
          <>
            <DateTimePicker
              mode="date"
              onChange={(event, date) => setSelectedDate(date)}
              value={selectedDate}
            />
            <SaveButtonRow onPress={() => save(selectedDate)} />
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={ styles.link }>Set birthday (currently {contact.getBirthdayStr()})</Text>
            </TouchableOpacity>
            { showPicker &&
              <DateTimePicker
                mode="date"
                onChange={(event, date) => { save(date); setShowPicker(false); }}
                value={selectedDate}
              />
            }
          </>
        )}
      </View>
      <EmbedFacebook url={getFbUrl(contact)}
        loggedInText={fbText}
        loggedOutText={fbText + " (You will need to login to Facebook.)"} />
    </View>
  );
}
