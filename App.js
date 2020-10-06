import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';


import Person from './Person';

export default function App() {
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
        setContacts(data);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Your contacts
        </Text>
        <TouchableOpacity
          onPress={() => alert('Hello, world!')}
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Select</Text>
        </TouchableOpacity>
      </View>
      <FlatList style={styles.list}
                data={contacts}
                renderItem={({item}) => <Person name={item.name} birthday="01/01/1974" county="Montgomery" />}
                keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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
});
