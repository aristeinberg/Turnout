import React, { useState, useContext } from 'react';
import { Picker, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, VOTE_STATUSES } from '../contacts';
import { styles } from '../SharedStyles'

export default function VotingStatus({route}) {
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [voteStatus, setVoteStatus] = useState(contact.data.voteStatus);
  const navigation = useNavigation();
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [instrumented, setInstrumented] = useState(false);

  const [firstName, lastName] = contact.name.split(" ");

  let webref = null;
  function handleStateChange(data) {
    // for some reason just using injectedJavascript was causing the code to get
    // run multiple times. instead we inject when the page completes loading and
    // only once.

    // wait til it's done loading
    if (data.loading) return;

    const injectJs = `
      (function() {
        document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$FirstNameText"].value = '${firstName}';
        document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$LastNameText"].value = '${lastName}';
        document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$DateOfBirthText"].value = '${contact.getShortBirthdayStr()}';
        document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$CountyDropDown"].value = '${contact.getCountyCode()}';
        //document.forms["aspnetForm"].submit();
      })();`;
      if (!instrumented) {
        webref.injectJavaScript(injectJs);
      }
      setInstrumented(true);
  }

  function save() {
    updateContact(contact.id, { voteStatus : voteStatus, });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  return (
    <ScrollView style={styles.container}>
      <Text>Use this page to check on their ballot status: </Text>
      <View style={[styles.webview, {margin: 10, height: 300}]}>
        <WebView source={{ uri: "https://www.pavoterservices.pa.gov/Pages/BallotTracking.aspx"}}
                ref={(r) => (webref = r)}
                onLoadStart={() => (setSpinnerVisible(true))}
                onLoad={() => setSpinnerVisible(false)}
                sharedCookiesEnabled={true}
                onMessage={(event) => {}}
                onNavigationStateChange={handleStateChange}
                /*injectedJavaScript={injectJs}*/ />
        {spinnerVisible && (
          <ActivityIndicator
            style={{
            flex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center' }}
            size="large"
          />
        )}
      </View>
      <Text>Select the status you see above from this list:</Text>
      <Picker selectedValue={voteStatus} onValueChange={setVoteStatus}>{
        Object.entries(VOTE_STATUSES).map(([key,description]) => (
          <Picker.Item label={description} value={key} />
        ))
      }</Picker>
      <TouchableOpacity style={[styles.button, styles.large]} onPress={save}>
        <Text style={styles.large}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
