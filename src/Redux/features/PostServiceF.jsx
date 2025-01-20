// src/redux/formSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ID, Databases, Storage,Query  } from "appwrite";
import client from "../../appWrite/AppwriteConfigPost";
import config from "../../appWrite/config";

// Create Profile
export const createProfile = createAsyncThunk(
  "form/createProfile",
  async ({ formData, role }, { rejectWithValue }) => {
    try {
      console.log("create profile called")
      const databases = new Databases(client);
      const storage = new Storage(client);
      console.log("formdata and role ",formData,role)

      // Upload profile image
      const profileUpload = await storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        formData.profileImage
        // ["user:current", "role:all"]
      );
      // console.log("file uploaded ")

      // Choose collection based on role
      const collectionId = role === "Employee"
        ? config.appwriteCollectionIdJobaryProfileId
        : config.appwriteCollectionIdEmployerProfileId;

        console.log("collection id",collectionId)
      // Store form data
      const response = await databases.createDocument(
        config.appwriteDatabaseId,
        collectionId,
        ID.unique(),
        {
          ...formData,
          profileImage: profileUpload.$id,
          role,
        }
      );
console.log(response)
      return response;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  "form/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const databases = new Databases(client);
      const storage = new Storage(client);

      // Retrieve email from localStorage
      const email = localStorage.getItem("Token");
      console.log(email)

      if (!email) {
        throw new Error("Email not found in localStorage");
      }
      console.log("Database ID:", config.appwriteDatabaseId);
console.log("Employee Collection ID:", config.appwriteCollectionIdJobaryProfileId);
console.log("Employer Collection ID:", config.appwriteCollectionIdEmployerProfileId);
console.log("Query:", Query.equal("email", email));


      // Fetch profiles from Employee collection
      const employeeResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );
      console.log("first res",employeeResponse)

      if (employeeResponse.documents.length > 0) {
        const profile = employeeResponse.documents[0];
        const role = "Employee";
  
        // Fetch profile image URL if it exists
        let profileImageUrl = null;
        if (profile.profileImage) {
          profileImageUrl = storage.getFilePreview(config.appwriteBucketId, profile.profileImage);
        }
  
        return { profile: { ...profile, profileImageUrl }, role };
      }

      // Fetch profiles from Employer collection
      const employerResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdEmployerProfileId,
        [Query.equal("email", email)]
      );
      console.log("second res",employerResponse)


      if (employerResponse.documents.length > 0) {
        let data= { profile: employerResponse.documents[0], role: "Employer" };
        const profile = data.profile;
        const role=data.role
        console.log("profile",profile)
        console.log("profile",profile.profileImage)
        // const role = "Employee";
        //       console.log("second value",profile)
        // // Fetch profile image URL if it exists
        let profileImageUrl = null;
        if (profile.profileImage) {
          profileImageUrl = storage.getFilePreview(config.appwriteBucketId, profile.profileImage);
        }
  
        return { profile: { ...profile, profileImageUrl },role  };
      }

      throw new Error("No profile found for the provided email");
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(error.message);
    }
  }
);

        // only update SelfNote Function
export const updateSelfNote = createAsyncThunk(
  "form/updateSelfNote",
  async ({ userId, newSelfNote }, { rejectWithValue }) => {
    try {
      const databases = new Databases(client);
      const updatedDocument = await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        userId, // Pass the document ID to update
        { selfNote: newSelfNote }
      );
      console.log("userId from selfnote",userId);
      return updatedDocument;
    } catch (error) {
      console.error("Error updating selfNote:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "form/updateProfile",
  async ({ userId, formData, role }, { rejectWithValue }) => {
    try {
      const databases = new Databases(client);

      // Choose collection based on role
      const collectionId = role === "Employee"
        ? config.appwriteCollectionIdJobaryProfileId
        : config.appwriteCollectionIdEmployerProfileId;

      // Update user profile
      const response = await databases.updateDocument(
        config.appwriteDatabaseId,
        collectionId,
        userId,
        formData
      );

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Profile
export const deleteProfile = createAsyncThunk(
  "form/deleteProfile",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const databases = new Databases(client);

      // Choose collection based on role
      const collectionId = role === "Employee"
        ? config.appwriteCollectionIdJobaryProfileId
        : config.appwriteCollectionIdEmployerProfileId;

      // Delete user profile
      await databases.deleteDocument(config.appwriteDatabaseId, collectionId, userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const formSlice = createSlice({
  name: "form",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    role: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile ={
          ...action.payload.profile,
          selfNote: action.payload.profile.selfNote || "Write your notes here...", // selfNote has a default value
        };
        state.role = action.payload.role;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SelfNote update sate function
      .addCase(updateSelfNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSelfNote.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.selfNote = action.payload.selfNote; // Update the selfNote in the profile
      })
      .addCase(updateSelfNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default formSlice.reducer;
