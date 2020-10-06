import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Person(props) {
  return (
    <View style={styles.person}>
      <View style={styles.personDetails}>
        <Text style={styles.name}>
          {props.name}
        </Text>
        <Text style={styles.detail}>
          {props.birthday}
        </Text>
        <Text style={styles.detail}>
          {props.county}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => alert('Hello, world!')}
        style={styles.action}>
        <Text style={{ fontSize: 20, color: '#fff' }}>Action</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  person: {
    flexDirection: 'row',
    flex: 1,
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
  action: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  }
});
