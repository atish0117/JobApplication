const config ={
    // appwriteUrl:String(import.meta.env.VITE_ENDPOINT),
    appwriteUrl:String(import.meta.env.VITE_ENDPOINT),
    appwriteProjectId:String(import.meta.env.VITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_DATABASE_ID),
    appwriteCollectionIdJobaryProfileId:String(import.meta.env.VITE_COLLECTION_ID_JOBARY_PROFILE),
    appwriteCollectionIdEmployerProfileId:String(import.meta.env.VITE_COLLECTION_ID_EMPLOYER_PROFILE),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteUserProjectId:String(import.meta.env.VITE_COLLECTION_ID_USER_PROJECT),
    appwriteJobPostId:String(import.meta.env.VITE_COLLECTION_ID_JOB_POST),
    appwriteAdminApiKey:String(import.meta.env.VITE_APPWRITE_ADMIN_API_KEY),

}
export default config
console.log("config",config)