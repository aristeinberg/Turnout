import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';

function PersonDetail(props) {
  const navigation = useNavigation();

  function navigateToEditBirthday() {
    return navigation.navigate("Edit Birthday", {contactId: props.contact.id});
  }
  function navigateToEditCounty() {
    return navigation.navigate("Edit County", {contactId: props.contact.id});
  }
  function navigateToCheckVoteStatus() {
    return navigation.navigate("Check Vote Status", {contactId: props.contact.id});
  }

  navigation.setOptions({
    title: props.contact.name,
  })

  return (
    <View style={styles.personDetail}>
      <View style={styles.personDetailRow}>
        <View style={{flex: 1}}>
          <Text>
            Birthday: {
              (props.contact.data.birthYear ? props.contact.getBirthdayStr() : "Unknown")
            }
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToEditBirthday}>
          <Text>
            {props.contact.data.birthDay ? "Edit" : "Find"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          County: { props.contact.getCountyName() }
        </Text>
        <TouchableOpacity style={styles.button} onPress={navigateToEditCounty}>
          <Text>{ props.contact.data.county ? "Edit" : "Find" }</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personDetailRow}>
        <Text>
          Voting status: { "Unknown" }
        </Text>
        <TouchableOpacity style={[styles.button, styles.disabled]} onPress={navigateToCheckVoteStatus}>
          <Text>{ false ? "Update" : "Check" }</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.warning]}>
        <Text style={styles.warning}>Delete contact</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PersonDetails({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  return (
    <PersonDetail contact={contact} />
  );
}

const styles = StyleSheet.create({
  personDetail: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
  },
  personDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: 380, // TODO: this should be 100% but it causes weird issues
    padding: 10,
  },
  button: {
    marginLeft: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
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