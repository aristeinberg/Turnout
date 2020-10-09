import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

import { ContactsContext } from './contacts';
import Person from './Person';

export default function PersonList() {
  return (
    <ContactsContext.Consumer>{({
        contacts, importContacts, setContacts
      }) => (
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
                  data={Object.values(contacts)}
                  renderItem={({item}) => <Person contact={item} />}
                  keyExtractor={(item) => item.id}
        />
        <StatusBar style="auto" />
      </View>
      )}
    </ContactsContext.Consumer>
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
});