import { useQuery, useMutation, useQueryClient, useInfiniteQuery,} from '@tanstack/react-query';
import { createPost, createUserAccount, deletePost, deleteSavedPost, followUser, getCurrentUser, getFollowers, getFollowing, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, unfollowUser, updatePost, updateUser } from '../appwrite/api';
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { QUERY_KEYS } from './QUERY_KEYS';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string
        }) => signInAccount(user)
    });
}

export const useSignOutAccount = () => {
    return useMutation({ mutationFn: signOutAccount });
    //return useMutation({ mutationFn: () => signOutAccount() })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likeArray }: {postId: string; likeArray: string[]}) => 
      likePost(postId, likeArray), onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
      }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: {postId: string; userId: string}) => 
      savePost(postId, userId), 
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
      }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( savedRecordId: string ) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
      }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return  useMutation({
    mutationFn: (post: IUpdatePost ) => 
      updatePost(post ), 
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
        })
      }
    
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( {postId, imageId}: {postId: string, imageId: string} ) => deletePost(postId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
      }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => { // missing colon here
      if(lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;

      return lastId;
    }
  })
}

export const useSearchPosts = (searchTerm: string) => {
  //const isEnabled = searchTerm.trim().length > 0;

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm //isEnabled,
  });
}

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, limit],
    queryFn: () => getUsers(limit),
    enabled: !!limit
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    
  })
}

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }:{followerId: string; followingId: string}) => followUser(followerId, followingId), 
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS ]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING ]
      })
    },
  });
}

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }:{followerId: string; followingId: string}) => unfollowUser(followerId, followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS ]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING ]
      })
    },
  });
}

export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS, userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId
  })
}

export const  useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId
  })
}

export const  useUpdateUser = () => {
  const queryClient = useQueryClient();

  return  useMutation({
    mutationFn: (user: IUpdateUser ) => 
      updateUser(user), 
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
        })
      }
  })
}
