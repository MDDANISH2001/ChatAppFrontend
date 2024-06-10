// fetchAndDeriveKeys.js
import decryptMessage from "./decryptKey";
import { deriveSessionKey } from "./generateSessionKey";

const fetchAndDeriveKeys = async (
  loggedInUserId,
  addedUserId,
  privateKeys,
  users,
  conversationId
  ) => {
  const loggedInUserEmail = sessionStorage.getItem("loggedInUserEmail");

  const splitConversationsId = conversationId.split("/");

  const [userAEmail] = users
    .map((user) => {
      if (
        splitConversationsId[0] === loggedInUserId &&
        splitConversationsId[0] === user._id
      ) {
        return user.email;
      } else if (
        splitConversationsId[0] === addedUserId &&
        splitConversationsId[0] === user._id
      ) {
        return user.email;
      }
      return undefined;
    })
    .filter((id) => id !== undefined);
  
  const [userBEmail] = users
    .map((user) => {
      if (
        splitConversationsId[1] === loggedInUserId &&
        splitConversationsId[1] === user._id
      ) {
        return user.email;
      } else if (
        splitConversationsId[1] === addedUserId &&
        splitConversationsId[1] === user._id
      ) {
        return user.email;
      }
      return undefined;
    })
    .filter((id) => id !== undefined);

  const tempCredentialforPrivateKey =
    "liame" + loggedInUserEmail + "innovation is our passion";
  const tempCredentialA = "liame" + userAEmail + "innovation is our passion";
  const tempCredentialB = "liame" + userBEmail + "innovation is our passion";
  const credentialForPrivateKey = tempCredentialforPrivateKey.slice(0, 32);
  const credentialA = tempCredentialA.slice(5, 37);
  const credentialB = tempCredentialB.slice(5, 37);

  const [userARootKey] = users
    .map((user) =>
      user._id === splitConversationsId[0] ? user.rootKey : undefined
    )
    .filter((id) => id !== undefined);

  const [userBRootKey] = users
    .map((user) =>
      user._id === splitConversationsId[1] ? user.rootKey : undefined
    )
    .filter((id) => id !== undefined);


  const privateKey = await decryptMessage(privateKeys, credentialForPrivateKey);

  const rootKeyA = await decryptMessage(userARootKey, credentialA);
  const rootKeyB = await decryptMessage(userBRootKey, credentialB);

  const [userAPublicKey] = users
    .map((user) => (user._id === loggedInUserId ? user.publicKey : undefined))
    .filter((id) => id !== undefined);

  const [userBPublicKey] = users
    .map((user) => (user._id === addedUserId ? user.publicKey : undefined))
    .filter((id) => id !== undefined);

  const rootKey = rootKeyA.slice(0, 32) + rootKeyB.slice(32);

  const sessionKey = await deriveSessionKey(
    privateKey,
    userBPublicKey,
    rootKey,
    userAPublicKey
  );

  return sessionKey;
};

export default fetchAndDeriveKeys;
