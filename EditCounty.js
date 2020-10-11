import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from './contacts';

export default function EditCounty({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [county, setCounty] = useState(contact.data.county);

  function save() {
    updateContact(contact.id, { county : county, });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  return (
    <View style={{flexDirection: "column", flex: 1}}>
      <TextInput style={{borderWidth: 1, borderColor: 'gray', margin: 5, padding: 5 }} value={county} onChangeText={setCounty} />
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});