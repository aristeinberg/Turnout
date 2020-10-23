import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { Text, View, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles';
import { ListButton } from '../components/Common';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    <ListButton onPress={navigateToPersonDetails}>
      <View style={styles.personDetails}>
        <Text style={styles.name}>
          {props.contact.name}
        </Text>
        <Text style={styles.detail}>
          Next step: {nextStep.label }
        </Text>
      </View>
    </ListButton>
  );
}

export default function PersonList() {
  // Test the NUX flow with this line:
  //const contacts = {}
  const { contacts } = useContext(ContactsContext);
  const navigation = useNavigation();
  function navigateToImportContacts() {
    return navigation.navigate("Import Contacts");
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigateToImportContacts}>
          <Text style={{color:'#fff', padding: 10 }}>
            {Object.keys(contacts).length == 0 ? "Add" : "Edit"}
          </Text>
        </TouchableOpacity>
      )
    });
  }, [contacts]);

  return (
    <View style={styles.container}>
      { Object.keys(contacts).length == 0 ? (
        <>
          <View style={[styles.intro, {flex: 5}]}>
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
              The 2020 presidential election is likely to hinge on the state
              of Pennsylvania, so we’re focused there for now. Pennsylvania
              has complicated rules for mail-in ballots (search around for
              “naked ballots”), so if your friends aren’t careful, it would
              be easy to have their ballots not count. The NY Times ranked
              Pennsylvania as the battleground state most likely to have
              issues this year. You can help your friends out - you can use
              this app to look up the status of their ballots and reach out
              to those who might be having trouble.
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
