const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const { logger } = require('../logger')

const dbConfig = config.get("Main.dbConfig");

const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: msg => logger.debug(msg)
  }
);


const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
      type: DataTypes.STRING,
      allowNull: true
  }
});

(async () => {
    await sequelize.sync({ force: true });
    console.log("The table for the User model was just (re)created!");
  })();