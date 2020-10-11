import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext, COUNTIES } from './contacts';

export default function EditCounty({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [county, setCounty] = useState(contact.getCountyCode());

  function save() {
    updateContact(contact.id, { county : county, });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  return (
    <View style={{flexDirection: "column", flex: 1}}>
      <Picker selectedValue={county} onValueChange={setCounty}>
        {
          Object.entries(COUNTIES).map(([num,name]) => (
            <Picker.Item label={name} value={num} />
          ))
        }
      </Picker>
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