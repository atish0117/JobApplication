// // adminService.js
// import { Client, Account } from 'appwrite';  // Importing Client and Account
// import config from "./config";

// // Initialize Appwrite client
// const client = new Client()
//   .setEndpoint(config.appwriteUrl) // Appwrite endpoint
//   .setProject(config.appwriteProjectId); // Appwrite project ID

// // Initialize Appwrite Account service (which includes Users)
// const account = new Account(client);

// // AdminService for managing users
// const adminService = {
//   // Function to fetch users (you may need to use a database or collections for user data)
//   fetchUsers: async () => {
//     try {
//       // Appwrite's account service doesn't directly provide 'list users', 
//       // You may have to fetch user data via a custom database collection
//       // Example:
//       const response = await client.database.listDocuments('usersCollection'); // replace with your actual collection
//       return response.documents; // Return the documents
//     } catch (error) {
//       throw new Error(error.message); // Handle errors
//     }
//   },

//   // Function to delete a user
//   deleteUser: async (userId) => {
//     try {
//       // Appwrite's Account service does not directly handle user deletion, 
//       // you would need to use a custom database or the Appwrite Admin SDK
//       await client.database.deleteDocument('usersCollection', userId); // Replace with actual collection
//       return userId; // Return the deleted user's ID
//     } catch (error) {
//       throw new Error(error.message); // Handle errors
//     }
//   },
// };

// export default adminService;
