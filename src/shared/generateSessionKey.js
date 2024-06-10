import sodium from "libsodium-wrappers";

const hexStringToUint8Array = (hexString) => {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

export const deriveSessionKey = async (
  privateKey,
  userBPublicKey,
  rootKey,
  publicKey
) => {
  await sodium.ready;

  const sharedSecretServer = sodium.crypto_kx_server_session_keys(
    hexStringToUint8Array(publicKey),
    hexStringToUint8Array(privateKey),
    hexStringToUint8Array(userBPublicKey)
  );

  const sharedSecretClient = sodium.crypto_kx_client_session_keys(
    hexStringToUint8Array(publicKey),
    hexStringToUint8Array(privateKey),
    hexStringToUint8Array(userBPublicKey)
  );

  const combinedClientKey = sodium.crypto_generichash(
    32,
    hexStringToUint8Array(rootKey),
    sharedSecretClient.sharedTx
  ); //used for decryption of data
  const combinedServerKey = sodium.crypto_generichash(
    32,
    hexStringToUint8Array(rootKey),
    sharedSecretServer.sharedRx
  ); // used for encryption of data

  const clientSessionKey = sodium.crypto_kdf_derive_from_key(
    32,
    1,
    "session",
    combinedClientKey,
    "hex"
  );
  const serverSessionKey = sodium.crypto_kdf_derive_from_key(
    32,
    1,
    "session",
    combinedServerKey,
    "hex"
  );

  return { clientSessionKey, serverSessionKey };
};
