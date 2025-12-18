import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // PORT
  PORT: Joi.number().required(),

  // ENV
  NODE_ENV: Joi.string().required(),

  // BREV0
  BREVO_API_KEY: Joi.string().required(),
  BREVO_SMTP_SERVER: Joi.string().required(),
  BREVO_PORT: Joi.number().required(),
  BREVO_LOGIN: Joi.string().required(),
  BREVO_PASSWORD: Joi.string().required(),
  BREVO_SENDER: Joi.string().required(),

  //GEMINI
  GEMINI_API_KEY: Joi.string().required(),
});
