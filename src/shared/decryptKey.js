const decryptMessage = async (encryptedData, credential) => {
  
  const decoder = new TextDecoder();
  
  const iv = new Uint8Array(encryptedData?.iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  const encryptedMessage = new Uint8Array(encryptedData?.encryptedMessage.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  const tag = new Uint8Array(encryptedData?.tag.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

  const encodedCredential =new TextEncoder().encode(credential)

  try{
    const key = await crypto.subtle.importKey(
      "raw",
      encodedCredential,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );


    const decrypted = await crypto.subtle.decrypt( 
      { name: "AES-GCM", 
      iv: iv }, // Fix: remove tag
      key,
      new Uint8Array([...encryptedMessage, ...tag]) // Fix: concatenate ciphertext and tag
    );

    const decryptedMessage = decoder.decode(decrypted);

    return decryptedMessage;

  } catch(error){
    console.error("Decryption Error:", error);
    throw new Error ("Decryption Failed" + error.message);
  }
}
export default decryptMessage