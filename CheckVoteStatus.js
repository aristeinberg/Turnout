import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { ContactsContext } from './contacts';

export default function VotingStatus({route}) {
  /*
  // ideally could scrape this, but MVP will probably be simply a matter of
  // embedding the webview

  function checkStatus() {
    const [firstName, lastName] = contact.name.split(" ");
    fetch("https://www.pavoterservices.pa.gov/Pages/BallotTracking.aspx", {
      "body": [
        "ctl00%24ContentPlaceHolder1%24FirstNameText=", firstName,
        "ctl00%24ContentPlaceHolder1%24LastNameText=", lastName,
        "ctl00%24ContentPlaceHolder1%24DateOfBirthText=",
        encodeURIComponent(contact.getShortBirthdayStr()),
        "ctl00%24ContentPlaceHolder1%24CountyDropDown=2335", // TODO: lookup county
        "ctl00%24ContentPlaceHolder1%24RetrieveButton=Submit",
      ].join('&'),
      "method": "POST",
    }).then(response => console.log(response));
  }
  */

  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  const [firstName, lastName] = contact.name.split(" ");
  const injectJs = `
    (function() {
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$FirstNameText"].value = '${firstName}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$LastNameText"].value = '${lastName}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$DateOfBirthText"].value = '${contact.getShortBirthdayStr()}';
      document.forms["aspnetForm"]["ctl00$ContentPlaceHolder1$CountyDropDown"].value = '${contact.getCountyCode()}';
      //document.forms["aspnetForm"].submit();
    })();`;

  return (
    <View style={{ flexDirection: 'column', flex: 1, padding: 10 }}>
      <Text>Voting status: { "Unknown" }</Text>
      <Text>Look up their voter info here:</Text>
      <View style={{ borderWidth: 1, borderColor: 'gray', flex: 1, margin: 5 }}>
        <WebView source={{ uri: "https://www.pavoterservices.pa.gov/Pages/BallotTracking.aspx"}}
                sharedCookiesEnabled={true}
                onMessage={(event) => {}}
                injectedJavaScript={injectJs} />
      </View>
    </View>
  );
}
