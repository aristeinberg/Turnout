- [ ] dialog to choose where to import contacts from
  - [ ] manually enter a contact by typing in the info
- In PersonDetails:
  - [ ] enter/find county
    - [ ] if you know what city they live in, we could tell you what county it's in
  - [ ] check voting status
    - [ ] open up https://www.pavoterservices.pa.gov/Pages/BallotTracking.aspx
    - [ ] ideally, we could scrape the info from this page
    - [ ] if scraping is not feasible, guide the user through what they need to enter as best as possible
    - [ ] if scraping is not available, prompt the user to tell us what the vote status they saw was
  - [ ] reach out to the contact
    - [ ] give some suggestions for what to text the person, based on their current vote status

- advanced features:
  - [ ] try to scan your phone calendar for birthdates
  - [ ] figure out other places to import contacts from, e.g. facebook
  - [ ] improved phone address book import that allows you to choose which contacts to import rather than purely relying on PA area codes

- bugs:
  - [ ] the birthday field doesn't automatically get refreshed when you hit save in PersonDetails