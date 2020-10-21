import React from 'react';
import * as Contacts from 'expo-contacts';
import { Counties, CountyCodes } from './components/PennCities';

export const ContactsContext = React.createContext();

export const ContactSources = {
  ADDRESS_BOOK: 'ab',
  MANUAL: 'man',
  FACEBOOK: 'fb',
};

export const VOTE_STATUSES = {
  [null]: 'Unknown',
  NO_VBM: 'Mail ballot not requested',
  VBM_REQUESTED: 'Ballot requested, not yet mailed',
  VBM_SENT_BY_OFFICE: 'Ballot mailed to voter',
  VBM_RECEIVED_BY_OFFICE: 'Ballot received by office',
  VBM_PROBLEM: 'Vote not recorded due to problem',
  VOTE_COUNTED: 'Vote recorded successfully',
}

export default class Contact {
  constructor(id, name, source, data) {
    if (id instanceof Contact) {
      Object.assign(this, id);
      return;
    }
    this.id = id;
    this.name = name;
    this.source = source;
    this.data = {};

    Object.assign(
      this.data,
      {
        birthMonth: null,
        birthDay: null,
        birthYear: null,
        phone: null,
        email: null,
        city: null,
        county: null,
        voteStatus: null,
        socialUrl: null,
        modified: new Date(),
      },
      data
    );
  }

  serialize() {
    return JSON.stringify({
      i: this.id,
      n: this.name,
      s: this.source,
      d: this.data,
    });
  }

  static deserialize(str) {
    const x = JSON.parse(str);
    return new Contact(x.i, x.n, x.s, x.d);
  }

  static serializeList(l) {
    if (!l) {
      return JSON.stringify(l);
    } else if (l.map) {
      // older versions used a List of contacts vs new versions using an Object
      return JSON.stringify(l.map((c) => c.serialize()));
    } else {
      return JSON.stringify(Object.values(l).map((c) => c.serialize()));
    }
  }

  static deserializeList(str) {
    const l = JSON.parse(str);
    if (l) {
      return Object.fromEntries(l.map((c) => Contact.deserialize(c))
                                 .map((c) => [c.id, c])); // extract the keys 
    } else {
      return null;
    }
  }

  getNextStep() {
    if (!this.data.birthYear) {
      return { page:'Edit Birthday', label: 'Find birthday'};
    }
    if (!this.data.county) {
      return { page:'Edit County', label: 'Find county'};
    }
    if (!this.data.voteStatus) {
      return { page:'Check Vote Status', label: 'Check voting status'};
    }
    return { page:'Reach Out', label: 'Reach out'};
  }

  getFourDigitBirthYear() {
    if (this.data.birthYear) {
      const addToYear = (this.data.birthYear < 1000 ? 1900 : 0);
      return addToYear + this.data.birthYear;
    }
  }

  getBirthdayStr() {
    if (!this.data.birthDay) {
      return 'Unknown';
    }
    const MONTHS = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December',
    };
    let s = `${MONTHS[this.data.birthMonth]} ${this.data.birthDay}`;
    if (this.data.birthYear) {
      s += `, ${this.getFourDigitBirthYear()}`;
    }
    return s;
  }

  getShortBirthdayStr() {
    if (!this.data.birthYear) {
      return '';
    }
    let month = String(this.data.birthMonth + 1);
    if (month.length == 1) {
      month = '0' + month;
    }
    let day = String(this.data.birthDay);
    if (day.length == 1) {
      day = '0' + day;
    }
    let year = String(this.getFourDigitBirthYear());
    
    return `${month}/${day}/${year}`;
  }

  getCountyCode() {
    if (this.data.county) {
      if (this.data.county in Counties) {
        return this.data.county;
      }
      return CountyCodes[this.data.county.toUpperCase()] || 0;
    }
    return 0;
  }

  getCountyName() {
    if (this.data.county) {
      if (this.data.county.toUpperCase &&
          this.data.county.toUpperCase() in CountyCodes) {
        return this.data.county;
      }
      return Counties[this.data.county] || "";
    }
    return "Unknown";
  }

  static fromAddressBook(c) {
    // TODO: should probably add some error checks in here as "c" is pretty
    // untrusted
    let contact = new Contact(c.id, c.name, ContactSources.ADDRESS_BOOK, {});
    contact.addDataFromAddressBook(c);
    return contact;
  }

  addDataFromAddressBook(c) {
    if (!c) return;
    if (c.birthday && !this.data.birthYear) {
      // format=gregorian calendar?
      this.data.birthYear = c.birthday.year;
      this.data.birthMonth = c.birthday.month;
      this.data.birthDay = c.birthday.day;
    }
    if (c.phoneNumbers && !this.data.phone) {
      // unclear if we need to store this since we can look up the contact
      // when we want to use this, and it's better to not need to deal
      // with multiple numbers. the field is useful though for non-address
      // book imported contacts.
      this.data.phone = c.phoneNumbers[0].digits ||
        c.phoneNumbers[0].number.replace(/[^0-9]/g, '');
    }
    if (c.emails && !this.data.email) {
      // same comment as phone number
      this.data.email = c.emails[0].email;
    }
    if (c.socialProfiles && !this.data.socialUrl) {
      for (const sp of c.socialProfiles) {
        if (sp.service == 'Facebook') {
          this.data.socialUrl = sp.url.replace('http:', 'https:').replace('/www.', '/m.');
        }
      }
    }
    if (c.addresses) {
      let filtered = c.addresses.filter((a) => {
        if (!a.region) {
          return false;
        }
        let region = a.region.toLowerCase();
        return (region == 'pennsylvania' || region == 'pa');
      });
      if (!this.data.city && filtered.length > 0) {
        this.data.city = filtered[0].city;
      }
    }
  }

  async lookupInAddressBook() {
    const { status } = await Contacts.requestPermissionsAsync();
    let fields = [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Birthday,
        Contacts.Fields.SocialProfiles,
        Contacts.Fields.Emails,
        Contacts.Fields.Addresses,
    ];
    if (status === 'granted') {
      let data = null;
      if (this.source == ContactSources.ADDRESS_BOOK) {
        data = await Contacts.getContactByIdAsync(this.id, fields);
      } else {
        const allContacts = await Contacts.getContactsAsync({ name: this.name, fields: fields });
        console.log(allContacts)
        const results = allContacts.data.filter((c) => c.name && c.name.toLowerCase() == this.name.toLowerCase());
        if (results.length > 0) data = results[0];
      }
      return data;
    }
  }
}
