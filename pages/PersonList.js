import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';

function Person(props) {
  const navigation = useNavigation();
  const nextStep = props.contact.getNextStep();

  function navigateToPersonDetails() {
    return navigation.navigate("Person Details", {contactId: props.contact.id});
  }
  function navigateToNextStep() {
    return navigation.navigate(nextStep.page, {contactId: props.contact.id});
  }

  return (
    <TouchableWithoutFeedback onPress={navigateToPersonDetails}>
      <View style={styles.person} >
        <View style={styles.personDetails}>
          <Text style={styles.name}>
            {props.contact.name}
          </Text>
          <Text style={styles.detail}>
            {props.contact.getBirthdayStr()}
          </Text>
          <Text style={styles.detail}>
            {props.contact.getCountyName()}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={navigateToNextStep}
            style={styles.secondaryAction}>
            <Text>{ nextStep.label }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function PersonList() {
  const { contacts, importContacts, setContacts } = useContext(ContactsContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Your contacts
        </Text>
        <TouchableOpacity
          onPress={importContacts}
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Import</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setContacts([])}
          style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList style={styles.list}
                data={Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name))}
                renderItem={({item}) => <Person contact={item} />}
                keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    color: '#888',
    fontSize: 24,
    marginHorizontal: 15,
  },
  list: {
  },
  person: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 10,
  },
  personDetails: {
    flexDirection: 'column',
    paddingRight: 20,
  },
  name: {
    fontSize: 18,
  },
  details: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  secondaryAction: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});