const mongodb = require("mongodb");
const fs = require("fs");
const { MongoClient, Binary } = mongodb;
require("dotenv").config();

const base64KeyId = "msYGFF7dS4uEH1WFJSXAUw==";
const buffer = Buffer.from(base64KeyId, "base64");
const keyIdBinary = new Binary(buffer, Binary.SUBTYPE_UUID);

const connectionString = process.env.MONGO_CONNECTION_STRING;

const keyVaultNamespace = "encryption.__keyVault";

const path = "../master-key.txt";
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};

const extraOptions = {
  mongocryptdURI: "mongodb://localhost:27020",
};

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const secureClient = (JSONSchemaCreator) => {
  const schemaMap = JSONSchemaCreator.map((schema) => schema(keyIdBinary));
  return new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders,
      schemaMap,
      extraOptions: extraOptions,
    },
  });
};

module.exports = { client, secureClient };
