import { ID, Query, ImageGravity, Models } from 'appwrite';
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { appwriteConfig, avatars, createClient, databases, storage, account } from './config';

export async function createUserAccount(user: INewUser) { 
  try {
    
    const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      
    );

    if(!newAccount) throw Error;
    //if(!newAccount) throw new Error('Failed' + JSON.stringify(newAccount));

    const avatarUrl =  avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
    });

    return newUser;
      
  } catch (error) {
      console.log(error);
      return error;
  }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        ) 
        // const newConnection = await databases.createDocument(
        //   appwriteConfig.databaseId,
        //   appwriteConfig.relationshipCollectionId,
        //   ID.unique(),
        //   user
        // )
        console.log(newUser);
        return  newUser;

    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string; password: string }) { 
  try {
    // const { account } = await createSessionClient();
    const session = await account.createEmailPasswordSession(user.email, user.password);

    // Store session token in localStorage (not secure but works for client-side)
    localStorage.setItem("appwriteSession", session.$id);
    localStorage.setItem("userRole", "role"); // Set user role properly

    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getCurrentUser() {
  try {
      const currentAccount = await account.get();
      console.log("Current Account:", currentAccount);

      if (!currentAccount) throw new Error("No current account found");

      const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal('accountId', currentAccount.$id)]
      );

      console.log("User Response:", response);

      if (!response || response.documents.length === 0) {
          console.log("No user document found for this accountId.");
          return null; // Return null explicitly to avoid undefined errors
      }

      return response.documents[0];
  } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
  }
}


export async function signOutAccount() { 
    try {
      const { account } = await createClient();
      const session = await account.deleteSession("current");

      return session;
        
    } catch (error) {
        console.log(error);
        return error;
    }
}




//Copy Work


  
// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId, 
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);

      console.log({ fileUrl})


      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g,"").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if(!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
     }
/*
    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }
*/
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) throw Error;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(postId: string | undefined, userId: string) {
  if (!postId) {
    console.error("Error: postId is undefined");
    return;
  }

  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: [userId],  // ✅ Fix: Pass as an array
        post: [postId],  // ✅ Fix: Pass as an array
      }
    );

    console.log("Saved Post Successfully:", savedPost);
    return savedPost;
  } catch (error) {
    console.error("Error saving post:", error);  // ✅ More detailed logging
  }
}


export const getSavedStatus = async (userId: string, postId: string) => {
  try {
    // Fetch user document
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    console.log("User ID: ", userId);

    // Get the saved post data
    const savedContent = user?.saves; 
    const savedId = savedContent?.$id;
    const savedPostObjects = savedContent?.post || []; // Ensure it's an array

    // Extract only the post IDs
    const savedPostIds = savedPostObjects.map((post: Models.Document) => post.$id);

    console.log("Save Content: ", savedContent);
    console.log("Save ID: ", savedId);
    console.log("Save Post IDs: ", savedPostIds);
    console.log("Checking if postId exists:", postId);
    console.log("Response from Appwrite:", savedPostIds.includes(postId));

    // Check if the postId exists in the saved list
    return savedPostIds.includes(postId);
  } catch (error) {
    console.error("Error fetching saved status:", error);
    return false;
  }
};

export const getSavedPosts = async (userId: string) => {
  try {
    // Step 1: Fetch user document (includes the `saves` field)
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Step 2: Extract saved posts from the `saves` relationship
    const savedContent = user?.saves;
    if (!savedContent) return [];

    // Step 3: Extract the array of saved post objects
    const savedPosts = savedContent.post || [];

    console.log("Saved Posts Data:", savedPosts);
    return savedPosts; // This already contains post details
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return [];
  }
};

export const debugSavesCollection = async () => {
  try {
    
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.limit(200)],
    );
    console.log("Saves Collection Data:", response.documents);
  } catch (error) {
    console.error("Error fetching Saves Collection:", error);
  }
};

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
    
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function followUser(followerId: string, followingId: string) {
  try {
      const relationship = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.relationshipsCollectionId,
          ID.unique(),
          {
              followerId: followerId,
              followingId: followingId,
              createdAt: new Date().toISOString()
          }
      );

      return relationship;
  } catch (error) {
      console.error(error);
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
      // Query to find the relationship document
      const relationships = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.relationshipsCollectionId,
          [
              Query.equal('followerId', followerId),
              Query.equal('followingId', followingId)
          ]
      );

      if (relationships.total === 0) throw new Error('Relationship not found');

      const relationshipId = relationships.documents[0].$id;

      await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.relationshipsCollectionId,
          relationshipId
      );

      return { status: 'ok' };
  } catch (error) {
      console.error(error);
  }
}

export async function getFollowers(userId: string) {
  try {
      const followers = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.relationshipsCollectionId,
          [Query.equal('followingId', userId)]
      );

      return followers.documents;
  } catch (error) {
      console.error(error);
  }
}

export async function getFollowing(userId: string) {
  try {
      const following = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.relationshipsCollectionId,
          [Query.equal('followerId', userId)]
      );

      return following.documents;
  } catch (error) {
      console.error(error);
  }
}
