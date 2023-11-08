const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contactsList = await listContacts();
  const result = contactsList.find((item) => item.id === contactId);
  return result || null;
}

async function removeContact(contactId) {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contactsList.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return result;
}

async function addContact({ name, email, phone }) {
  const contactsList = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: nanoid(),
  };
  contactsList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  contactsList[index] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return contactsList[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
