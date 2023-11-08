const Joi = require("joi");
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
module.exports = {
  addSchema,
};
