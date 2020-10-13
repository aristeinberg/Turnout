import React, { useState, useContext } from 'react';
import { Picker, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, VOTE_STATUSES } from '../contacts';
import { styles } from '../SharedStyles'

export default function VotingStatus({route}) {
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [voteStatus, setVoteStatus] = useState(contact.data.voteStatus);
  const navigation = useNavigation();

  const [firstName, lastName] = contact.name.split(" ");
  const injectJs = `
    (function() {
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$FirstNameText"].value = '${firstName}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$LastNameText"].value = '${lastName}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$DateOfBirthText"].value = '${contact.getShortBirthdayStr()}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$CountyDropDown"].value = '${contact.getCountyCode()}';
      //document.forms["aspnetForm"].submit();
    })();`;

  function save() {
    updateContact(contact.id, { voteStatus : voteStatus, });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  return (
    <View style={styles.container}>
      <Text>Voting status: </Text>
      <Picker selectedValue={voteStatus} onValueChange={setVoteStatus}>{
        Object.entries(VOTE_STATUSES).map(([key,description]) => (
          <Picker.Item label={description} value={key} />
        ))
      }</Picker>
      <TouchableOpacity style={[styles.button, styles.large]} onPress={save}>
        <Text style={styles.large}>Save</Text>
      </TouchableOpacity>
      <Text>Look up their voter info here:</Text>
      <View style={styles.webview}>
        <WebView source={{ uri: "https://www.pavoterservices.pa.gov/Pages/BallotTracking.aspx"}}
                sharedCookiesEnabled={true}
                onMessage={(event) => {}}
                injectedJavaScript={injectJs} />
      </View>
    </View>
  );
}
