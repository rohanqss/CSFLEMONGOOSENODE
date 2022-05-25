const fs = require("fs");
const express = require("express");
const app=express()
const bodyParser = require("body-parser");

const mongodb = require("mongodb");
const User = require("./models/User");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const JSONSchemaCreator = require("./schema-creator");
const JSONSchemaCreator1 = require("./schema-creater2");

const { MongoClient, Binary } = mongodb;
require("./db");

const base64KeyId = 'CzFJpSb3R5yCW6RvTe07XQ=='; // use the base64 data key id returned by createKey() in the prior step
// const buffer = Buffer.from(base64KeyId, "base64");
// const keyIdBinary = new Binary(buffer, Binary.SUBTYPE_UUID);

const jsonSchemas = JSONSchemaCreator([new Binary(Buffer.from(base64KeyId, "base64"), 4)]); 
const jsonSchemas1 = JSONSchemaCreator1([new Binary(Buffer.from(base64KeyId, "base64"), 4)]); 

const connectionString = "mongodb://localhost:27017/";

const keyVaultNamespace = "encryption.__keyVault";

const path = "./master-key.txt";
const localMasterKey = fs.readFileSync(path);

const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};

const patientSchema = {
  "medicalRecords.patients": jsonSchemas,
  "medicalRecords.patients2": jsonSchemas1,

};

const extraOptions = {
  mongocryptdURI: "mongodb://localhost:27020",
};

const secureClient = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    schemaMap: patientSchema,
    extraOptions: extraOptions,
  },
});

async function insertPatient(name, bloodType, ssn) {
  try {
    await secureClient.connect();
    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients");
    const writeResult = await collection.insertOne({
			name,
      ssn,
      bloodType,
    });
    console.log(writeResult);
  } catch (writeError) {
    console.error("writeError occurred:", writeError);
  }
}

// insertPatient(
//   'Jon Doe',
//   "O+",
//   '1234567',
// );

async function findPatient() {
  try {
    await secureClient.connect();
    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients");
    const patient= await collection.find().toArray();
    console.log(patient)
  } catch (readError) {
    console.error("readError occurred:", readError);
  }
}

// findPatient();


app.post("/registerUserManual", async (req, res) => {
  try {
    const startTime = new Date();
    const user = new User({
      name: req.body.name,
      bloodType: req.body.bloodType,
      ssn:req.body.ssn,
    });

    const endTime = new Date();
    await user.save();
    res.json({ user, time: endTime - startTime });
  } catch (err) {
    console.log(err);
  }
});

app.post("/registerUserCsfle", async (req, res) => {
  try {
    console.log("ejej",req.body)
    await secureClient.connect();

    const startTime = new Date();
    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients");


    const writeResult = await collection.insertOne({
      name: req.body.name,
      bloodType: req.body.bloodType,
      ssn:req.body.ssn,
    });

    const endTime = new Date();
    return res.json({ writeResult, time: endTime - startTime });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});
app.post("/registerUserCsfle1", async (req, res) => {
  try {
    console.log("ejej",req.body)
    await secureClient.connect();

    const startTime = new Date();
    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients2");


    const writeResult = await collection.insertOne({
      name: req.body.name,
      bloodType: req.body.bloodType,
      ssn:req.body.ssn,
    });

    const endTime = new Date();
    return res.json({ writeResult, time: endTime - startTime });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});
app.get("/fetchUsersNormal", async (req, res) => {
  try {
    const startTime = new Date();
    const users = await User.find({});
    const endTime = new Date();
    res.json({ users, time: endTime - startTime });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});
app.get("/fetchUsersUnEncrypt", async (req, res) => {
  const startTime = new Date();
  try {
    await secureClient.connect();

    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients");
    const users = await collection.find({}).toArray();
    const endTime = new Date();
    res.json({ users, time: endTime - startTime });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});

app.get("/fetchUsersUnEncrypt1", async (req, res) => {
  const startTime = new Date();
  try {
    await secureClient.connect();

    const keyDB = secureClient.db("medicalRecords");
    const collection = keyDB.collection("patients2");
    const users = await collection.find({}).toArray();
    const endTime = new Date();
    res.json({ users, time: endTime - startTime });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
});

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on Port ${port}`));