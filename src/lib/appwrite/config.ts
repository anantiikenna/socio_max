import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID, 
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    relationshipsCollectionId: import.meta.env.VITE_APPWRITE_RELATIONSHIPS_COLLECTION_ID,
}

export const client = new Client();

client.setEndpoint(appwriteConfig.url).setProject(appwriteConfig.projectId); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export const createClient = () => {
  const client = new Client().setEndpoint(appwriteConfig.url!).setProject(appwriteConfig.projectId!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.url!)
    .setProject(appwriteConfig.projectId!);

  const account = new Account(client);

  try {
    // ✅ Fetch the active session from Appwrite
    const session = await account.getSession('current');

    if (!session) {
      throw new Error("User session is missing. Please log in again.");
    }

    return { account };
  } catch (error) {
    console.error("Session retrieval failed:", error);
    throw new Error("User session is missing. Please log in again.");
  }
};