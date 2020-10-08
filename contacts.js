import * as Contacts from 'expo-contacts';

export const ContactSources = {
    ADDRESS_BOOK: 'ab',
    MANUAL: 'man',
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

        Object.assign(this.data, {
            birthMonth : null,
            birthDay : null,
            birthYear : null,
            phone : null,
            email : null,
            address : null,
            city : null,
            county : null,
            voteStatus : null,
            modified : new Date(),
        }, data);
    }

    // update a field's value, and bump the modification time
    // (there's probably a cleaner way to do this??)
    set(field, value) {
        // TBD: do we need to do something up the stack to make this "stick"? probably!
        this.data[field] = value;
        this.data.modified = new Date();
    }

    serialize() {
        return JSON.stringify({
            'i': this.id,
            'n': this.name,
            's': this.source,
            'd': this.data,
        });
    }

    static deserialize(str) {
        const x = JSON.parse(str);
        return new Contact(x.i, x.n, x.s, x.d);
    }

    static serializeList(l) {
        return JSON.stringify(l.map(c => c.serialize()));
    }
    static deserializeList(str) {
        const l = JSON.parse(str);
        return l.map(c => Contact.deserialize(c));
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
            s += `, ${this.data.birthYear}`;
        }
        return s;
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