import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, VOTE_STATUSES } from '../contacts';

export default function PersonDetails({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const navigation = useNavigation();

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
        <TouchableOpacity style={[styles.button, styles.disabled]} onPress={navigateToCheckVoteStatus}>
          <Text>{ false ? "Update" : "Check" }</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          Last reached out: { "Unknown" }
        </Text>
        <TouchableOpacity style={[styles.button, styles.disabled]} onPress={navigateToReachOut}>
          <Text>Reach out</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.warning]}>
        <Text style={styles.warning}>Delete contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  personDetail: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  personDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  disabled: {
    borderColor: 'gray',
    color: 'gray',
  },
  warning: {
    borderColor: 'red',
    color: 'red',
  },
});