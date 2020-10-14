import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View, FlatList, TouchableWithoutFeedback, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';
import { styles } from '../SharedStyles';

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
    <TouchableOpacity onPress={navigateToPersonDetails}>
      <View style={styles.person} >
        <View style={styles.personDetails}>
          <Text style={styles.name}>
            {props.contact.name}
          </Text>
          <Text style={styles.detail}>
            Next step: {nextStep.label }
          </Text>
        </View>
        <View style={styles.actions}>
          <View style={{flex: 1}}>
          <Text>&gt;</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PersonList() {
  // Test the NUX flow with this line:
  //const contacts = {}
  const { contacts, clearContacts } = useContext(ContactsContext);
  const navigation = useNavigation();
  function navigateToImportContacts() {
    return navigation.navigate("Import Contacts");
  }
  navigation.setOptions({
    headerRight: () => (
      <Button
        onPress={navigateToImportContacts}
        color='#fff'
        title={Object.keys(contacts).length == 0 ? "Add" : "Edit"}
        />
    )
  })


  return (
    <View style={styles.container}>
      { Object.keys(contacts).length == 0 ? (
        <>
          <View style={[styles.intro, {flex: 2}]}>
            <Text style={styles.introLead}>
              To get started, add some contacts.
            </Text>
            <Text style={styles.introSecondary}>
              You can import contacts from your phone address book or from
              Facebook. <Text style={styles.link}>
                Click "Add" in the top right corner.
              </Text>
            </Text>
            <Text>
              Once you've added them, we'll help you keep tabs on them to make
              sure their vote counts.
            </Text>
            <Text>
              For now, we're focusing on Pennsylvania. It's a highly impactful
              state and with recent rulings on things like "naked ballots" we
              want to make sure everyone's votes are counted successfully.
            </Text>
          </View>
          <View style={{flex: 1}}/>
        </>
      ) : (
          <FlatList style={styles.list}
                    data={Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name))}
                    renderItem={({item}) => <Person contact={item} />}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={() => (
                      <Text style={styles.listFooter}>
                        Want to have even more impact? Add more contacts!
                        Click "Edit" in the top right.
                      </Text>
                    )}
          />
      )}
      <StatusBar style="light" />
    </View>
  );
}
