import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles';
import { SaveButtonRow, Typeahead } from '../components/Common';
import { CitiesToCounties, Counties } from '../components/PennCities';

export default function EditCounty({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [county, setCounty] = useState(contact.getCountyCode());
  const [city, setCity] = useState(contact.data.city);

  function save() {
    updateContact(contact.id, { city: city, county : county, });
    navigation.navigate("Person Details", {contactId: contact.id});
  }

  const cityData = Object.entries(CitiesToCounties)
    .map(([city, county]) => ({ key: city, value: county }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const countyData = Object.entries(Counties)
    .map(([idNum,name]) => ({ key: name, value: idNum }));

  const countyIndexes = {};
  for (let i = 0; i < countyData.length; i++) {
    countyIndexes[countyData[i].value] = i;
  }

  let countyRef = null;
  console.log('default:', county, Counties[county]);

  return (
    <View style={styles.container}>
      <Typeahead data={cityData}
                 style={{flex: 2, marginBottom: 10}}
                 placeholder='(Optional) search for city to lookup county'
                 selectedKey={contact.data.city}
                 onValueChange={(key, val) => {
                   console.log(key, val, countyIndexes[val]);
                   countyRef.scrollToIndex({index: countyIndexes[val]});
                   setCity(key);
                   setCounty(val);
                 } } />
      <Typeahead data={countyData}
                 style={{flex: 2, marginBottom: 10}}
                 fRef={(r) => (countyRef = r)}
                 selectedKey={Counties[county]}
                 placeholder='Search for county directly'
                 onValueChange={(key, val) => {
                   console.log(val);
                   setCounty(val);
                 } } />
      <View style={{flex: 1}}>
        <SaveButtonRow onPress={save} />
      </View>
    </View>
  );
}
