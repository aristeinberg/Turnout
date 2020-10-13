import React from 'react';
import * as Contacts from 'expo-contacts';

export const ContactsContext = React.createContext();

export const ContactSources = {
  ADDRESS_BOOK: 'ab',
  MANUAL: 'man',
  FACEBOOK: 'fb',
};

export const COUNTIES = {
  0: "Unknown",
  2290: "ADAMS",
  2291: "ALLEGHENY",
  2292: "ARMSTRONG",
  2293: "BEAVER",
  2294: "BEDFORD",
  2295: "BERKS",
  2296: "BLAIR",
  2297: "BRADFORD",
  2298: "BUCKS",
  2299: "BUTLER",
  2300: "CAMBRIA",
  2301: "CAMERON",
  2302: "CARBON",
  2303: "CENTRE",
  2304: "CHESTER",
  2305: "CLARION",
  2306: "CLEARFIELD",
  2307: "CLINTON",
  2308: "COLUMBIA",
  2309: "CRAWFORD",
  2310: "CUMBERLAND",
  2311: "DAUPHIN",
  2312: "DELAWARE",
  2313: "ELK",
  2314: "ERIE",
  2315: "FAYETTE",
  2316: "FOREST",
  2317: "FRANKLIN",
  2318: "FULTON",
  2319: "GREENE",
  2320: "HUNTINGDON",
  2321: "INDIANA",
  2322: "JEFFERSON",
  2323: "JUNIATA",
  2324: "LACKAWANNA",
  2325: "LANCASTER",
  2326: "LAWRENCE",
  2327: "LEBANON",
  2328: "LEHIGH",
  2329: "LUZERNE",
  2330: "LYCOMING",
  2331: "McKEAN",
  2332: "MERCER",
  2333: "MIFFLIN",
  2334: "MONROE",
  2335: "MONTGOMERY",
  2336: "MONTOUR",
  2337: "NORTHAMPTON",
  2338: "NORTHUMBERLAND",
  2339: "PERRY",
  2340: "PHILADELPHIA",
  2341: "PIKE",
  2342: "POTTER",
  2343: "SCHUYLKILL",
  2344: "SNYDER",
  2345: "SOMERSET",
  2346: "SULLIVAN",
  2347: "SUSQUEHANNA",
  2348: "TIOGA",
  2349: "UNION",
  2350: "VENANGO",
  2351: "WARREN",
  2352: "WASHINGTON",
  2353: "WAYNE",
  2354: "WESTMORELAND",
  2355: "WYOMING",
  2356: "YORK",
};

export const COUNTY_CODES = 
  Object.fromEntries(Object.entries(COUNTIES).map(([k,v]) => [v, k]));

export const VOTE_STATUSES = {
  UNKNOWN: 'Unknown',
  VBM_REQUESTED: 'Voter requested mail ballot',
  VBM_SENT_BY_OFFICE: 'Mail ballot was sent to voter but they have not received it yet',
  VBM_RECEIVED_BY_VOTER: 'Mail ballot received by voter but not sent back',
  VBM_SENT_BACK: 'Voter indicates mail ballot sent back',
  VBM_RECEIVED_BY_OFFICE: 'Mail ballot sent back and received by office',
  PLANS_TO_VOTE: 'Voter indicates a plan to vote in person',
  VOTED_BUT_NOT_COUNTED: 'The person indicates they have voted but this is not reflected on the PA site',
  VOTE_COUNTED: 'The person voted successfully, as reflected on the site',
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
        address: null,
        city: null,
        county: null,
        voteStatus: null,
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
    if (!this.data.birthDay) {
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
      return '';
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
      if (this.data.county in COUNTIES) {
        return this.data.county;
      }
      return COUNTY_CODES[this.data.county.toUpperCase()] || 0;
    }
    return 0;
  }

  getCountyName() {
    if (this.data.county) {
      if (this.data.county.toUpperCase() in COUNTY_CODES) {
        return this.data.county;
      }
      return COUNTIES[this.data.county] || "";
    }
    return "";
  }

  static fromAddressBook(c) {
    // TODO: should probably add some error checks in here as "c" is pretty
    // untrusted
    let data = {};
    if (c.birthday) {
      // format=gregorian calendar?
      data.birthYear = c.birthday.year;
      data.birthMonth = c.birthday.month;
      data.birthDay = c.birthday.day;
    }
    if (c.phoneNumbers) {
      // unclear if we need to store this since we can look up the contact
      // when we want to use this, and it's better to not need to deal
      // with multiple numbers. the field is useful though for non-address
      // book imported contacts.
      data.phone = c.phoneNumbers[0].digits;
    }
    if (c.emails) {
      // same comment as phone number
      data.email = c.emails[0].email;
    }
    return new Contact(c.id, c.name, ContactSources.ADDRESS_BOOK, data);
  }

  async lookupInAddressBook() {
    if (this.source != ContactSources.ADDRESS_BOOK) {
      return;
    }

    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const data = await Contacts.getContactByIdAsync(this.id, [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Birthday,
        Contacts.Fields.SocialProfiles,
        Contacts.Fields.Emails,
      ]);
      return data;
    }
  }
}
