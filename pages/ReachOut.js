import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';

import { ContactsContext, VOTE_STATUSES } from '../contacts';

export default function ReachOut({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  let keyMessage = '';
  switch (contact.data.voteStatus) {
    case VOTE_STATUSES.VBM_REQUESTED:
      keyMessage = "I heard you requested a mail ballot, keep your eyes out for it! And don't forget the privacy envelope.";
      break;
    case VOTE_STATUSES.VBM_SENT_BY_OFFICE:
      keyMessage = "It looks like your mail ballot was sent over to you - did you receive it yet?"
      break;
    case VOTE_STATUSES.VBM_RECEIVED_BY_VOTER:
      keyMessage = "I know you got that mail ballot. Did you have a chance to send it back in yet?"
      break;
    case VOTE_STATUSES.VBM_SENT_BACK:
      keyMessage = "It looks like the office still hasn't received your mail ballot. Are you SURE you sent it?"
      break;
    case VOTE_STATUSES.VBM_RECEIVED_BY_OFFICE:
      keyMessage = "Great job getting your mail ballot back. Did you remember the privacy envelope?"
      break;
    case VOTE_STATUSES.PLANS_TO_VOTE:
      keyMessage = "Still on track to vote? Are you going to vote early?"
      break;
    case VOTE_STATUSES.VOTED_BUT_NOT_COUNTED:
      keyMessage = "Thanks for voting! For some reason the web site still indicates that your vote has not counted. Do you need help figuring this out? Maybe consider a provisional ballot?"
      break;
    case VOTE_STATUSES.VOTE_COUNTED:
      keyMessage = "Great job voting! Are you open to helping me try to get other people to turn out?"
      break;
    case VOTE_STATUSES.UNKNOWN:
    default:
      keyMessage = "Hey, are you planning to vote in this election? You should do it ASAP!";
      break;
  }

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
    <View style={styles.view}>
      <Text style={styles.instructions} >You should tell { contact.name } something like this: "{ keyMessage }"</Text>
      <TouchableOpacity style={styles.button} onPress={text}>
        <Text>Text them</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={call}>
        <Text>Call them</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
  },
  instructions: {
  },
  button: {
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
});