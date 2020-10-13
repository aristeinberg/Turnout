import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../SharedStyles';
import { ContactsContext, VOTE_STATUSES } from '../contacts';

export default function PersonDetails({route}) {
  const { contacts, removeContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const navigation = useNavigation();
  if (!contact) {
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
    <View style={styles.personDetail}>
      <View style={styles.personDetailRow}>
        <View style={{flex: 1}}>
          <Text>
            Birthday: {
              (contact.data.birthYear ? contact.getBirthdayStr() : "Unknown")
            }
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToEditBirthday}>
          <Text>
            {contact.data.birthDay ? "Edit" : "Find"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          County: { contact.getCountyName() }
        </Text>
        <TouchableOpacity style={styles.button} onPress={navigateToEditCounty}>
          <Text>{ contact.data.county ? "Edit" : "Find" }</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <View style={{flex: 1}}>
          <Text>
            Voting status: { VOTE_STATUSES[contact.data.voteStatus] }
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToCheckVoteStatus}>
          <Text>{ false ? "Update" : "Check" }</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          Last reached out: { "Unknown" }
        </Text>
        <TouchableOpacity style={styles.button} onPress={navigateToReachOut}>
          <Text>Reach out</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.warning]} onPress={deleteContact}>
        <Text style={styles.warning}>Delete contact</Text>
      </TouchableOpacity>
    </View>
  );
}
