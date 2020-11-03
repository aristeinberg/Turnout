import * as Amplitude from 'expo-analytics-amplitude';
import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, View, TextInput, Linking, Clipboard, Alert } from 'react-native';
import Communications from 'react-native-communications';
import { useNavigation } from '@react-navigation/native';
import { URL } from 'react-native-url-polyfill';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles'
import { ListButton } from '../components/Common';

export default function ReachOut({route}) {
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [phone, setPhone] = useState(contact.data.phone);
  const [emailAddress, setEmailAddress] = useState(contact.data.email);
  const [attemptedOutreach, setAttemptedOutreach] = useState(false);
  const navigation = useNavigation();

  const firstName = contact.name.split(' ', 1)[0];
  let keyMessage = `Hi ${firstName}, I'm concerned about this election so have been checking up on all my Facebook friends who live in Pennsylvania.\n\n`;
  switch (contact.data.voteStatus) {
    case 'VBM_REQUESTED':
      keyMessage += "I see you requested a mail ballot. We're running out of time, do you know where the nearest dropbox is?";
      break;
    case 'VBM_SENT_BY_OFFICE':
      keyMessage += "Are you planning to return your mail ballot? Do you know where the nearest dropbox is?"
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
      keyMessage += "Were you able to vote yet?";
      break;
  }

  function text() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'TEXT',
      voteStatus: contact.data.voteStatus,
    });
    Communications.textWithoutEncoding(phone, keyMessage);
    setAttemptedOutreach(true);
  }
  function call() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'CALL',
      voteStatus: contact.data.voteStatus,
    });
    Communications.phonecall(phone, false);
    setAttemptedOutreach(true);
  }
  function email() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'EMAIL',
      voteStatus: contact.data.voteStatus,
    });
    Communications.email([emailAddress], null, null, 'checking in', keyMessage);
    setAttemptedOutreach(true);
  }
  async function messenger() {
    Amplitude.logEventWithProperties('REACH_OUT', {
      type: 'MESSENGER',
      voteStatus: contact.data.voteStatus,
    });
    const socialUrl = new URL(contact.data.socialUrl);
    let messengerUrl = 'https://m.me';
    if (socialUrl.pathname != '/profile.php') {
      messengerUrl += socialUrl.pathname;
    } else {
      messengerUrl += '/' + socialUrl.searchParams.get('id');
    }
    console.log(socialUrl, socialUrl.pathname, messengerUrl);
    Alert.alert('Note',
      'We will copy the message to the clipboard so you can paste it from inside of Messenger.',
      [{ text: 'OK', onPress: async function() {
          Clipboard.setString(keyMessage);
          await Linking.openURL(messengerUrl);
          setAttemptedOutreach(true);
        }}]);
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
      { attemptedOutreach ? (
        <>
          <Text>Did you reach out to them?</Text>
          <ListButton text="Yes" onPress = {() => {
            updateContact(contact.id, { reachOutTime: new Date() });
            navigation.goBack();
          }} />
          <ListButton text="No" onPress={() => setAttemptedOutreach(false) } />
        </>
      ) : (
        <>
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
          { contact.data.socialUrl && (
            <TouchableOpacity style={[styles.button, styles.large]} onPress={messenger}>
              <Text style={styles.large}>Facebook Messenger</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  )
}
