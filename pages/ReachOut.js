import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';

import { ContactsContext, VOTE_STATUSES } from '../contacts';
import { styles } from '../SharedStyles'

export default function ReachOut({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  let keyMessage = "Hi, I'm concerned about this election so have been checking the vote status of my friends in PA through an app called Drive Turnout.\n\n";
  switch (contact.data.voteStatus) {
    case 'VBM_REQUESTED':
      keyMessage += "I see you requested a mail ballot, keep your eyes out for it! And don't forget the privacy envelope.";
      break;
    case 'VBM_SENT_BY_OFFICE':
      keyMessage += "It looks like your mail ballot was sent over to you - did you receive it yet?"
      break;
    case 'VBM_RECEIVED_BY_VOTER':
      keyMessage += "I know you got that mail ballot. Did you have a chance to send it back in yet?"
      break;
    case 'VBM_SENT_BACK':
      keyMessage += "It looks like the office still hasn't received your mail ballot. Are you SURE you sent it?"
      break;
    case 'VBM_RECEIVED_BY_OFFICE':
      keyMessage += "Great job getting your mail ballot back. Did you remember the privacy envelope?"
      break;
    case 'PLANS_TO_VOTE':
      keyMessage += "Still on track to vote? Are you going to vote early?"
      break;
    case 'VOTED_BUT_NOT_COUNTED':
      keyMessage += "Thanks for voting! For some reason the web site still indicates that your vote has not counted. Do you need help figuring this out? Maybe consider a provisional ballot?"
      break;
    case 'VOTE_COUNTED':
      keyMessage += "Great job voting! Are you open to helping me try to get other people to turn out?"
      break;
    case 'UNKNOWN':
    default:
      keyMessage += "Are you planning to vote in this election? You should do it ASAP!";
      break;
  }
  console.log('reachout:', contact.data.voteStatus, keyMessage);

  function text() {
    Communications.text(contact.data.phone, keyMessage)
  }
  function call() {
    Communications.call(contact.data.phone);
  }
  function email() {
    Communications.email(contact.data.email, null, null, 'checking in', keyMessage)
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16 }}>
        You should tell 
        <Text style={{ fontWeight: 'bold' }}> { contact.name } </Text>
        something like this:
      </Text>
      <View style={styles.messagePreview}><Text>{ keyMessage }</Text></View>
      <TouchableOpacity style={[styles.button, styles.large]} onPress={text}>
        <Text style={styles.large}>Text them</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.large]} onPress={call}>
        <Text style={styles.large}>Call them</Text>
      </TouchableOpacity>
    </View>
  )
}
