const mongoose = require("mongoose");

const dbConnection = () => {
  try {
    mongoose.connect(process.env.DB_CNN);

    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error inicializando base de datos");
  }
};

module.exports = {
  dbConnection,
};
