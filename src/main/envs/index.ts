export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  LOGGER_LEVEL: process.env.LOGGER_LEVEL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
})