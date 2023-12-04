export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  LOGGER_LEVEL: process.env.LOGGER_LEVEL,
})