const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);
  if (!contactById) {
    throw HttpError(404, "Not found");
  }
  res.json(contactById);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const addContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(addContact);
};

const updateById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const contactUpdate = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contactUpdate) {
    throw HttpError(404, "Not found");
  }
  res.json(contactUpdate);
};
const updateFav = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const contactUpdate = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contactUpdate) {
    throw HttpError(404, "Not found");
  }
  res.json(contactUpdate);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await Contact.findByIdAndDelete(contactId);
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
  updateFav: ctrlWrapper(updateFav),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
