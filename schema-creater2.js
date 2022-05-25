module.exports = function (keyId) {
    return {
      bsonType: "object",
      encryptMetadata: {
        keyId,
      },
      properties: {
          name:{
            encrypt: {
                bsonType: "string",
                algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
              },
          },
        bloodType: {
          encrypt: {
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          },
        },
        ssn: {
          encrypt: {
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          },
        },
      },
    };
  };
  