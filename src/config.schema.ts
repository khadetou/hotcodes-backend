import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  // STAGE: Joi.string().valid('dev', 'prod').required(),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  REFRESH_TOKEN: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
