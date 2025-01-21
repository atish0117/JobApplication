// src/redux/formSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ID, Databases, Storage,Query  } from "appwrite";
import client from "../../appWrite/AppwriteConfigPost";
import config from "../../appWrite/config";

// Create Profile
const databases = new Databases(client);
const storage = new Storage(client);
export const createProfile = createAsyncThunk(
  "form/createProfile",
  async ({ formData, role }, { rejectWithValue }) => {
    try {
      console.log("create profile called")
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

      // Fetch profiles from Employee collection
      const employeeResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

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

// Add User  Project
export const addProject = createAsyncThunk(
  "form/addProject",
  async (newProject, { rejectWithValue }) => {
    try {
      let thumbnailFile = null;

      // Upload thumbnail
      if (newProject.thumbnail) {
        thumbnailFile = await storage.createFile(
          config.appwriteBucketId,
          ID.unique(),
          newProject.thumbnail
        );
      }

      // Upload additional images
      const imageFiles = newProject.images.length
        ? await Promise.all(
            newProject.images.map((image) =>
              storage.createFile(config.appwriteBucketId, ID.unique(), image)
            )
          )
        : [];

      // Create the project document
      const projectResponse = await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        ID.unique(),
        {
          title: newProject.title,
          description: newProject.description,
          technologies: newProject.technologies,
          thumbnail: thumbnailFile ? thumbnailFile.$id : null,
          images: imageFiles.map((file) => file.$id),
        }
      );

      // Link project to user profile
      const email = localStorage.getItem("Token");
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;
        const updatedProjects = [
          ...(userResponse.documents[0].projects || []),
          projectResponse.$id,
        ];

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdJobaryProfileId,
          userId,
          { projects: updatedProjects }
        );
      }

      return { ...newProject, id: projectResponse.$id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Fetch User Projects
export const fetchProjects = createAsyncThunk(
  "form/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem("Token");
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length === 0) {
        throw new Error("User not found");
      }

      const projectIds = userResponse.documents[0].projects || [];
      const projectDetails = await Promise.all(
        projectIds.map((projectId) =>
          databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteUserProjectId,
            projectId
          )
        )
      );

      return projectDetails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete User Project
export const deleteProject = createAsyncThunk(
  "form/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const project = await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        projectId
      );

      // Delete files
      if (project.thumbnail) {
        await storage.deleteFile(config.appwriteBucketId, project.thumbnail);
      }
      if (project.images && project.images.length > 0) {
        await Promise.all(
          project.images.map((imageId) =>
            storage.deleteFile(config.appwriteBucketId, imageId)
          )
        );
      }

      // Delete the project document
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        projectId
      );

      // Remove from user's profile
      const email = localStorage.getItem("Token");
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;
        const updatedProjects = userResponse.documents[0].projects.filter(
          (id) => id !== projectId
        );

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdJobaryProfileId,
          userId,
          { projects: updatedProjects }
        );
      }

      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching job posts
export const fetchJobPosts = createAsyncThunk(
  "form/fetchJobPosts",
  async (profile, { rejectWithValue }) => {
    try {
      const jobPostIds = profile?.jobPosts || [];
      const jobPostsDetails = await Promise.all(
        jobPostIds.map((jobPostId) =>
          databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteJobPostId,
            jobPostId
          )
        )
      );
      console.log("jobpost id",jobPostsDetails)
      return jobPostsDetails;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for deleting a job post
export const deleteJobPost = createAsyncThunk(
  "form/deleteJobPost",
  async ({ jobPostId, email }, { rejectWithValue, dispatch }) => {
    try {
      // Delete the Job Post document
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteJobPostId,
        jobPostId
      );
      console.log(`Job Post ${jobPostId} deleted successfully.`);
      // Fetch the employer profile
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdEmployerProfileId,
        [Query.equal("email", email)]
      );
      console.log(`Job Post ${jobPostId} not found, skipping.`);
      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;

        // Update the jobPosts array in the employer profile
        const updatedJobPosts = (
          userResponse.documents[0].jobPosts || []
        ).filter((postId) => postId !== jobPostId);

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdEmployerProfileId,
          userId,
          { jobPosts: updatedJobPosts }
        );
      }

      return jobPostId; // Return the deleted jobPostId
    } catch (error) {
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

// user profile fetch function
export const fetchAllUserProfiles = createAsyncThunk(
  "form/fetchUserProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const databases = new Databases(client);
      const response = await databases.listDocuments(config.appwriteDatabaseId, config.appwriteCollectionIdJobaryProfileId);
      return response.documents;
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const formSlice = createSlice({
  name: "form",
  initialState: {
    projects: [],
    jobPosts: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
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

       // Add Project
    builder.addCase(addProject.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(addProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects.push(action.payload);
    })
    builder.addCase(addProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

       // Fetch Projects
       builder.addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      builder.addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      builder.addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Delete Project
    builder.addCase(deleteProject.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    })
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // fetch jobpost
    builder
    .addCase(fetchJobPosts.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchJobPosts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.jobPosts = action.payload;
    })
    .addCase(fetchJobPosts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
      // delete jobpost
  builder
    .addCase(deleteJobPost.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteJobPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Filter out the deleted job post by ID
      state.jobPosts = state.jobPosts.filter(
        (jobPost) => jobPost.$id !== action.payload
      );
    })
    .addCase(deleteJobPost.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
        // fetch all user profile state
        builder
        .addCase(fetchAllUserProfiles.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchAllUserProfiles.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.profiles = action.payload;
        })
        .addCase(fetchAllUserProfiles.rejected, (state, action) => {
          state.status = "failed";
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
