import React, { useContext, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';

import Contact, { ContactsContext, ContactSources } from '../contacts';
import { styles } from '../components/SharedStyles';
import { ListButton } from '../components/Common';

const PA_AREA_CODES = [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 878]
const PA_NUM_REGEX = '^\\+?1?(' + PA_AREA_CODES.join('|') + ')';

function ContactList(props) {
  const [data, setData] = useState(props.data.sort((a,b) => a.name.localeCompare(b.name)));

  function select(item) {
    props.addToContacts({[item.id]: item});
    setData(data.filter((i) => i.id != item.id));
  }

  // TODO: search box if list is > n
  return (
    <FlatList 
      data={data}
      renderItem={({item}) => (
        <ListButton 
          onPress={(e) => select(item)}
          buttonText="+">
          <View style={{ flexDirection: 'row', width: 500 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name.split(' ', 2)[0]}</Text>
            <Text> {item.name.split(' ', 2)[1]}</Text>
          </View>
        </ListButton>
      )}
      keyExtractor={(item) => item.id }
    />);
}

export default function ImportAddressBook(props) {
  const { contacts, addToContacts } = useContext(ContactsContext);
  const [ pennAddresses, setPennAddresses ] = useState(null);
  const [ notPennAddresses, setNotPennAddresses ] = useState(null);
  const navigation = useNavigation(); // TODO: streamline navigation when complete

  useEffect(() => { importContacts(); }, []);
  
  async function importContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Birthday,
          Contacts.Fields.SocialProfiles,
          Contacts.Fields.Emails,
          Contacts.Fields.Addresses,
        ],
      });

      function isPA(c) {
        return (
          (c.phoneNumbers &&
           c.phoneNumbers.filter(p => p.digits &&
                                       p.digits.match(PA_NUM_REGEX)).length > 0) ||
          (c.addresses &&
           c.addresses.filter(a => a.region.toLowerCase() == 'pennsylvania' || a.region.toLowerCase() == 'pa').length > 0)
        );
      }

      const newEntries = data.filter(c => !(c.id in contacts) && c.name);
      const pennEntries = newEntries.filter(isPA)
                                    .map(Contact.fromAddressBook);
      const notPennEntries = newEntries.filter(c => !isPA(c))
                                       .map(Contact.fromAddressBook);
      setPennAddresses(pennEntries);
      setNotPennAddresses(notPennEntries);
    }
  }

  return (
    <View style={{flex: 1}}>
      { pennAddresses &&
        <View style={{flex: 
            Math.max(pennAddresses.length, notPennAddresses ? notPennAddresses.length/2 : 1)}}>
          <Text style={{fontWeight: 'bold', padding: 10}}>People with PA-based contact info:</Text>
          <ContactList data={pennAddresses} addToContacts={addToContacts} />
        </View>
      }
      { notPennAddresses && 
        <View style={{flex: notPennAddresses.length}}>
          { pennAddresses &&
            <Text style={{fontWeight: 'bold', padding: 10}}>Everyone else:</Text>
          }
          <ContactList data={notPennAddresses} addToContacts={addToContacts} />
        </View>
      }
    </View>
  );
}