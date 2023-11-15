const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
contactSchema.post("save", handleMongooseError);

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
  favorite: Joi.boolean(),
});
const updateFavSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);
const schemas = {
  addSchema,
  updateFavSchema,
};
module.exports = {
  Contact,
  schemas,
};
