import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Person(props) {
  const navigation = useNavigation();

  function navigateToPersonDetails() {
    return navigation.navigate("PersonDetails", {contact: props.contact.serialize()});
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
            {props.contact.data.county}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => alert('Hello, world!')}
            style={styles.action}>
            <Text style={{ fontSize: 20, color: '#fff' }}>Action</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToPersonDetails}
            style={styles.secondaryAction}>
            <Text style={{ fontSize: 20 }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
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
