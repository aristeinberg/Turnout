import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

import { ContactsContext } from './contacts';
import Person from './Person';

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
});