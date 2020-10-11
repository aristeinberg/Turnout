import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ContactsContext } from '../contacts';

export default function ReachOut({route}) {
  const { contacts } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];

  return (
    <View>
    </View>
  )
}

const styles = StyleSheet.create({
});