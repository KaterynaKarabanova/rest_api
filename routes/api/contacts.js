const express = require("express");
const Joi = require("joi");
const contacts = require("../../models/contacts");
const router = express.Router();
const { HttpError } = require("../../helpers");
router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});
const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string()
    .length(13)
    .pattern(/^\(\d{3}\)\d{3}-\d{4}$/)
    .messages({
      "string.pattern.base": `Phone number must use this format (XXX)XXX-XXXX.`,
    })
    .required(),
});
router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await contacts.getContactById(contactId);
    if (!contactById) {
      throw HttpError(404, "Not found");
    }
    res.json(contactById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const addContact = await contacts.addContact(req.body);
    res.status(201).json(addContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await contacts.removeContact(contactId);
    if (!deleteContact) {
      throw HttpError(404, "Not found");
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "missing fields");
    }
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const contactUpdate = await contacts.updateContact(contactId, req.body);
    if (!contactUpdate) {
      throw HttpError(404, "Not found");
    }
    res.json(contactUpdate);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
