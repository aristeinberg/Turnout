import React, { useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../components/SharedStyles';
import { ListButton } from '../components/Common';
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

  navigation.setOptions({
    title: contact.name,
  })

  return (
    <View style={styles.container}>
      <ListButton onPress={navigateToEditBirthday}
                  text={'Birthday: ' + contact.getBirthdayStr()} />
      <ListButton onPress={navigateToEditCounty} 
                  text={'County: ' + contact.getCountyName()} />
      <ListButton onPress={navigateToCheckVoteStatus} 
                  text={'Voting status: ' + VOTE_STATUSES[contact.data.voteStatus]} />
      <ListButton onPress={navigateToReachOut} 
                  text={'Last time reaching out: Unknown'} />
      <ListButton onPress={deleteContact} 
                  warn={'Are you sure you want to delete this contact?'}
                  text={'Delete contact'} />
    </View>
  );
}
