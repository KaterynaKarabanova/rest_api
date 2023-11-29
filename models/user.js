const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const validateEmailRegex = /^\S+@\S+\.\S+$/;
const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    name: {
      type: String,
      minlength: 2,
      required: [true, "Set users name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: validateEmailRegex,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(validateEmailRegex).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(validateEmailRegex).required(),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);
const schemas = {
  registerSchema,
  loginSchema,
};
module.exports = {
  User,
  schemas,
};
