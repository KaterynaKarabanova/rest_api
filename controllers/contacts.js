const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await contacts.getContactById(contactId);
  if (!contactById) {
    throw HttpError(404, "Not found");
  }
  res.json(contactById);
};

const add = async (req, res) => {
  const addContact = await contacts.addContact(req.body);
  res.status(201).json(addContact);
};

const updateById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const contactUpdate = await contacts.updateContact(contactId, req.body);
  if (!contactUpdate) {
    throw HttpError(404, "Not found");
  }
  res.json(contactUpdate);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await contacts.removeContact(contactId);
  if (!deleteContact) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "contact deleted",
  });
};
module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
