import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles';
import { SaveButtonRow, Typeahead } from '../components/Common';
import { CitiesToCounties, Counties, CountyCodes } from '../components/PennCities';

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

  const cities = Object.keys(CitiesToCounties)
    .sort((a, b) => a.localeCompare(b));

  const counties = Object.values(Counties)
    .sort((a, b) => a.localeCompare(b));

  let countyRef = null;

  return (
    <View style={styles.container}>
      <Typeahead data={cities}
                 style={{flex: 2, marginBottom: 10}}
                 placeholder='(Optional) search for city to lookup county'
                 selected={city}
                 onValueChange={(val) => {
                   const countyCode = CitiesToCounties[val];
                   const countyStr = Counties[countyCode];
                   const countyIndex = counties.indexOf(countyStr);
                   setCity(val);
                   setCounty(countyCode);
                   countyRef.scrollToIndex({index: countyIndex});
                 } } />
      <Typeahead data={counties}
                 style={{flex: 2, marginBottom: 10}}
                 fRef={(r) => (countyRef = r)}
                 selected={Counties[county]}
                 placeholder='Search for county directly'
                 onValueChange={(val) => {
                   console.log(val, CountyCodes[val]);
                   setCounty(CountyCodes[val]);
                 } } />
      <View style={{flex: 1}}>
        <SaveButtonRow onPress={save} />
      </View>
    </View>
  );
}
