import { Client, Account, ID } from "appwrite";
import config from "./config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    
    this.client
      .setEndpoint(config.appwriteUrl) 
    
      .setProject(config.appwriteProjectId)
      // .setKey(config.appwriteAdminApiKey)
    this.account = new Account(this.client);
    console.log("this account",this.account)
    
  }
  async signup({ fullName, email, password }) {
    try {
      // Create a new account
      const userAccount = await this.account.create(ID.unique(), email, password, fullName);
      console.log("User created:", userAccount);
  
      // Send verification email with the correct redirect URL
      // const verificationUrl = `http://localhost:5173/verify-email?userId=${userAccount.$id}&secret=${userAccount.secret}`; 
      // const verify = await this.account.createVerification(verificationUrl);
      // console.log("Verification email sent:", verify);
            
      const session = await this.account.createEmailPasswordSession(email, password);
      console.log("Login successful!", session);
      this.assignRoleAfterLogin(userAccount.$id); // Function to handle role logic

      return { userId: userAccount.$id, email: userAccount.email };; // Return the created account
    } catch (err) {
      console.error(err,"Signup error:", err.message);
      throw new Error(err.message);
    }
  }
  
  assignRoleAfterLogin(userId) {
    // Implement your role assignment logic here
    // This could be assigning the role in your app's state or database
    console.log(`Assigning role to user: ${userId}`);

    // For example, if you want to assign "user" role, add it in your app state
    localStorage.setItem("userRole", "user");
  }

  // Verify email
  async verifyEmail(userId, secret) {
    try {
      const verificationResponse = await this.account.updateVerification(userId, secret);
      console.log("Email verified successfully:", verificationResponse);
      return verificationResponse;
    } catch (err) {
      console.error("Verification error:", err.message);
      throw new Error(err.message);
    }
  }

  

  // Login
  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      console.log("Login successful!", session);
      const user = await this.getCurrentUser();
      console.log("Logged in user details:", user);
      return session;
    } catch (err) {
      console.error("Login failed:", err.message);
      throw new Error("Invalid email or password. Please try again.");
    }
  }


  // Get the current user
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      console.log("Current user:", user);
      return { userId: user.$id, email: user.email };
    } catch (err) {
      console.error("Get current user error:", err.message);
      // throw new Error("User is not authenticated");
    }
  }

  // Logout
  async logout() {
    try {
      await this.account.deleteSessions();
      localStorage.removeItem("userRole");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout error:", err.message);
      throw new Error(err.message);
    }
  }

  // Recover password
  async recoverPassword(email) {
    try {
      const recovery = await this.account.createRecovery(email, "http://localhost:5173/reset-password");
      console.log("Recovery email sent:", recovery);
      return recovery;
    } catch (err) {
      console.error("Password recovery error:", err.message);
      throw new Error(err.message);
    }
  }

  // Reset password
  async resetPassword(userId, secret, newPassword) {
    try {
      const response = await this.account.updateRecovery(userId, secret, newPassword, newPassword);
      console.log("Password reset successfully:", response);
      return response;
    } catch (err) {
      console.error("Password reset error:", err.message);
      throw new Error(err.message);
    }
  }
}

const authService = new AuthService();
export default authService;










