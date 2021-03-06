import React, { useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ContactsContext } from '../contacts';
import { styles } from '../components/SharedStyles';
import { Typeahead } from '../components/Common';
import { CitiesToCounties, Counties, CountyCodes } from '../components/PennCities';

export default function EditCounty({route}) {
  const navigation = useNavigation();
  const { contacts, updateContact } = useContext(ContactsContext);
  const contact = contacts[route.params.contactId];
  const [county, setCounty] = useState(contact.getCountyCode());
  const [city, setCity] = useState(contact.data.city);

  const cities = Object.keys(CitiesToCounties)
    .sort((a, b) => a.localeCompare(b));

  const counties = Object.values(Counties)
    .sort((a, b) => a.localeCompare(b));

  let countyRef = null;

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
        <Text style={{padding: 10}}>To look up the voter's status, we need their county. You can
        either select their city and we will choose the corresponding county,
        or you can select their county directly.</Text>
        <Typeahead data={cities}
                  style={{flex: 2, marginBottom: 10}}
                  placeholder='(Optional) search for city to lookup county'
                  value={city}
                  onValueChange={(val) => {
                    const countyCode = CitiesToCounties[val];
                    const countyStr = Counties[countyCode];
                    const countyIndex = counties.indexOf(countyStr);
                    console.log('val changed', val, countyCode, countyStr, countyIndex)
                    setCity(val);
                    setCounty(countyCode);
                    countyRef.scrollToIndex({index: countyIndex});
                    updateContact(contact.id, { city: val, county: countyCode });
                  } } />
        <Typeahead data={counties}
                  style={{flex: 2, marginBottom: 10}}
                  fRef={(r) => (countyRef = r)}
                  value={Counties[county]}
                  placeholder='Search for county directly'
                  onValueChange={(county) => {
                    const countyCode = CountyCodes[county.toUpperCase()];
                    console.log(county, countyCode);
                    setCounty(countyCode);
                    updateContact(contact.id, { county: countyCode });
                  } } />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
