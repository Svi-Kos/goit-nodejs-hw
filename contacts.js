const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function parsedContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return console.error(error.message);
  }
}

async function listContacts() {
  try {
    const contactList = await parsedContacts();
    console.log("Contact List:");
    console.table(contactList);
    return contactList;
  } catch (err) {
    return console.error(err.message);
  }
}

async function getContactById(contactId) {
  try {
    const contactList = await parsedContacts();
    const contactById = contactList.find(({ id }) => id === contactId);
    console.log(`Contact by ${contactId} id`);
    console.table(contactById);

    return contactById;
  } catch (err) {
    return console.error(err.message);
  }
}

async function removeContact(contactId) {
  try {
    const contactList = await parsedContacts();
    const idxToDelete = contactList.findIndex((item) => item.id === contactId);

    if (idxToDelete === -1) {
      throw new Error(`Contact with id ${contactId} not found`);
    }

    const newContacts = contactList.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));

    console.log("Contact was deleted");
    console.table(contactList[idxToDelete]);

    return contactList[idxToDelete];
  } catch (err) {
    return console.error(err.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = { id: v4(), name, email, phone };
    const contactList = await parsedContacts();
    const newContactList = [...contactList, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContactList));

    console.log(`${name} was added to Contact List`);
    console.table(newContact);

    return newContact;
  } catch (error) {
    return console.error(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
