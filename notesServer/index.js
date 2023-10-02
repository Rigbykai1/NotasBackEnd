const app = require("./app");

const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen( process.env.PORT || config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
