function getKeysFromConversation(data, selectedChat) {
    // Split the conversationId to get individual user IDs
    if(selectedChat.chatIds){
        const [userId1, userId2] = selectedChat.chatIds.split('/');
    
        // Find the corresponding users in the data array
        const user1 = data.find(user => user._id === userId1);
        const user2 = data.find(user => user._id === userId2);
    
        // Extract the keys from these user objects
        // You might want to handle the case where a user is not found
        const keysUser1 = user1 ? user1.keys : null;
        const user1Email = user1 ? user1.email: null;
        const keysUser2 = user2 ? user2.keys : null;
        const user2Email = user2 ? user2.email : null;
    
        // Return the object with the format { user1: keys, user2: keys }
        return { user1Keys: keysUser1, user2Keys: keysUser2, user1Email, user2Email };
    }
}
export default getKeysFromConversation