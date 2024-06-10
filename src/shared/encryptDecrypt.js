import forge from 'node-forge';

// Convert hex to ByteStringBuffer
const hexToBytes = (hex) => forge.util.createBuffer(forge.util.hexToBytes(hex));

// Function to encrypt data with a session key in hex format
export const encryptDataWithSessionKey = (data, sessionKeyHex) => {
  
  try {
    const sessionKey = hexToBytes(sessionKeyHex);
    
    // Generate a random IV (Initialization Vector)
    const iv = forge.random.getBytesSync(12); // 96 bits IV for GCM
    
    const dataBytes = forge.util.encodeUtf8(data);
    
    // Encrypt the data using the session key and IV
    const cipher = forge.cipher.createCipher('AES-GCM', sessionKey);
    cipher.start({ iv, tagLength: 128 });
    cipher.update(forge.util.createBuffer(dataBytes));
    cipher.finish();

    const authTag = cipher.mode.tag.data;
    
    // Get the encrypted bytes along with the IV
    const encrypted = cipher.output.getBytes();

    // Convert the encrypted bytes and IV to a Base64-encoded string
    const encryptedBase64 = forge.util.encode64(iv + encrypted + authTag);
    return encryptedBase64;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

// Function to decrypt data with a session key in hex format
export const decryptDataWithSessionKey = (encryptedData, sessionKeyHex) => {

  try {
    const sessionKey = hexToBytes(sessionKeyHex);
    
    const encryptedBytesWithIV = forge.util.decode64(encryptedData);
    
    // Extract the IV and encrypted data
    const iv = encryptedBytesWithIV.slice(0, 12);
    const encryptedBytes = encryptedBytesWithIV.slice(12, -16); // Fix 2: consider tag
    const authTag = encryptedBytesWithIV.slice(-16);

    // Decrypt the data using the session key and IV
    const decipher = forge.cipher.createDecipher('AES-GCM', sessionKey);

    decipher.start({ iv, tag: authTag, tagLength: 128 });
    decipher.update(forge.util.createBuffer(encryptedBytes));
    decipher.finish();

    // Get the decrypted bytes
    const decrypted = decipher.output.getBytes();

    // Convert the decrypted bytes to a UTF-8 string
    const decryptedData = forge.util.decodeUtf8(decrypted);

    return decryptedData;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};
