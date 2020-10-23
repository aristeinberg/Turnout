import React, { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../components/SharedStyles';
import { ListButton, DateText } from '../components/Common';
import { ContactsContext, VOTE_STATUSES } from '../contacts';

export default function PersonDetails({route}) {
  const { contacts, removeContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const navigation = useNavigation();
  if (!contact) {
    console.log('contact not there yet')
    navigation.navigate("Your Contacts");
    return null;
  }

  function navigateToEditBirthday() {
    return navigation.navigate("Edit Birthday", {contactId: contact.id});
  }
  function navigateToEditCounty() {
    return navigation.navigate("Edit County", {contactId: contact.id});
  }
  function navigateToCheckVoteStatus() {
    return navigation.navigate("Check Vote Status", {contactId: contact.id});
  }
  function navigateToReachOut() {
    return navigation.navigate("Reach Out", {contactId: contact.id});
  }
  function deleteContact() {
    removeContact(contact.id);
    return navigation.navigate("Your Contacts");
  }

  useEffect(() => {
    navigation.setOptions({
      title: contact.name,
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.topLevelText} >
        Your outreach to {contact.name} will be more effective if you can
        customize it based on their voting status. In Pennsylvania, in order
        to check on people's voting statuses, you need their name, birthday,
        and county. We can help you find that below...
      </Text>
      <Text style={styles.topLevelText}>Next step: { contact.getNextStep().label }.</Text>
      <ListButton onPress={navigateToEditBirthday}
                  text={'Birthday: ' + contact.getBirthdayStr()} />
      <ListButton onPress={navigateToEditCounty} 
                  text={'County: ' + contact.getCountyName()} />
      <ListButton onPress={navigateToCheckVoteStatus} 
                  text={'Voting status: ' + VOTE_STATUSES[contact.data.voteStatus] +
                    (contact.data.voteStatusTime ? ' (as of ' + DateText(contact.data.voteStatusTime) + ')'
                                                 : '')} />
      <ListButton onPress={navigateToReachOut} 
                  text={'Last reached out: ' + DateText(contact.data.reachOutTime)} />
      <ListButton onPress={deleteContact} 
                  warn='Are you sure you want to delete this contact?'
                  text='Delete contact' />
      <Text style={styles.topLevelText}>
        Contact last updated: { DateText(contact.data.modified) }
      </Text>
    </View>
  );
}
