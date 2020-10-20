- next steps:
  - [ ] if they already have a city set up (e.g. from the address book), select county automatically
  - [ ] track facebook login status and present a different url/UI for logging in the first time
  - [ ] display the time the vote status was last updated
  - [ ] track when you last reached out, take notes on the result and/or update their vote status
  - [ ] fix styling on webviews to fit more naturally into the page

- android:
  - [ ] date/time picker in birthday screen is weird, pops open, and crashes if you hit "cancel"

- polish:
  - [ ] get rid of the remaining "save" buttons - make everything save automatically on update
  - [ ] can move the separator into FlatList instead of in ListButton (so that it isn't replicated at the end of the list)
  - [ ] searchbox at top of address book importer (move to typeahead?)
  - [ ] some way to make clear what the next step is from the person details page
  - [ ] help figuring out birthdays:
     - [ ] automatically navigate the facebook profile to the basic info section
     - [ ] try to scan your phone calendar for birthdates
  - [ ] help you figure out what county they live in:
     - [ ] show their FB profile to find their city
  - [ ] help contacting people
     - [ ] link/webview to contact on FB messenger

- bugs:
  - [ ] if i try to auto-submit the PA ballot checker form, for some reason it gets into a refresh loop, so for now auto-submission is disabled.
  - [ ] is the back nav button missing its "<"?