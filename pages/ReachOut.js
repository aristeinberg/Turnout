import * as Amplitude from 'expo-analytics-amplitude';
import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, View, TextInput } from 'react-native';
import Communications from 'react-native-communications';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles'

export default function ReachOut({route}) {
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [phone, setPhone] = useState(contact.data.phone);
  const [emailAddress, setEmailAddress] = useState(contact.data.email);

  let keyMessage = "Hi, I'm concerned about this election so have been checking the vote status of my friends in PA through an app called Drive Turnout.\n\n";
  switch (contact.data.voteStatus) {
    case 'VBM_REQUESTED':
      keyMessage += "I see you requested a mail ballot, keep your eyes out for it! And don't forget the privacy envelope.";
      break;
    case 'VBM_SENT_BY_OFFICE':
      keyMessage += "It looks like your mail ballot was sent over to you - did you receive it yet?"
      break;
    case 'VBM_RECEIVED_BY_OFFICE':
      keyMessage += "Great job getting your mail ballot back. Did you remember the privacy envelope?"
      break;
    case 'NO_VBM':
      keyMessage += "Are you voting in person this year? When are you going to do it?"
      break;
    case 'VBM_PROBLEM':
      keyMessage += "It looks like there was a problem with your ballot. Do you need help getting this sorted out?"
      break;
    case 'VOTE_COUNTED':
      keyMessage += "I see you successfully voted - great job! Are you open to helping me try to get other people to turn out?"
      break;
    case 'UNKNOWN':
    default:
      keyMessage += "Are you planning to vote in this election? You should do it ASAP!";
      break;
  }

  function text() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'TEXT',
      voteStatus: contact.data.voteStatus,
    });
    Communications.textWithoutEncoding(phone, keyMessage);
  }
  function call() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'CALL',
      voteStatus: contact.data.voteStatus,
    });
    Communications.phonecall(phone, false);
  }
  function email() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'EMAIL',
      voteStatus: contact.data.voteStatus,
    });
    Communications.email([emailAddress], null, null, 'checking in', keyMessage);
  }
  function updatePhoneNumber(val) {
    setPhone(val);
    updateContact(contact.id, { phone: val });
  }
  function updateEmailAddress(val) {
    setEmailAddress(val);
    updateContact(contact.id, { email: val });
  }

  return (
    <View style={styles.container, {padding: 10, backgroundColor: '#fff'}}>
      <Text style={{ fontSize: 16 }}>
        You should tell 
        <Text style={{ fontWeight: 'bold' }}> { contact.name } </Text>
        something like this:
      </Text>
      <View style={styles.messagePreview}><Text>{ keyMessage }</Text></View>
      <TextInput style={{ marginHorizontal: 10, borderColor: 'black', borderBottomWidth: 1, height: 40 }}
            autoCorrect={false}
            autoCompleteType='tel'
            keyboardType='phone-pad'
            placeholder="Phone number"
            value={phone} onChangeText={updatePhoneNumber} />
      <TouchableOpacity style={[styles.button, styles.large]} onPress={text}>
        <Text style={styles.large}>Text them</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.large]} onPress={call}>
        <Text style={styles.large}>Call them</Text>
      </TouchableOpacity>
      <TextInput style={{ marginHorizontal: 10, borderColor: 'black', borderBottomWidth: 1, height: 40 }}
            autoCorrect={false}
            autoCompleteType='email'
            keyboardType='email-address'
            placeholder="Email"
            value={emailAddress} onChangeText={updateEmailAddress} />
      <TouchableOpacity style={[styles.button, styles.large]} onPress={email}>
        <Text style={styles.large}>Email them</Text>
      </TouchableOpacity>
    </View>
  )
}
