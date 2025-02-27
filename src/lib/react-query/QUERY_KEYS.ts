export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",
  
    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",
    
  
    //SAVE KEYS
    GET_SAVED_POSTS = "getSavedPosts",
    CHECK_IF_SAVED ="getSavedStatus",

    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",

    // FOLLOWERS
    GET_FOLLOWERS = "getFollowers",
    GET_FOLLOWING = "getFollowing",
  }
  