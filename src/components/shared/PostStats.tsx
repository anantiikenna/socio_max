import React, { useState, useCallback } from "react";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost, useCheckIfSaved } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import Loader from "./Loader";
import { PostStatsProps } from "@/types";
// import { debugSavesCollection } from "@/lib/appwrite/api";


const PostStats = ({ post, userId }: PostStatsProps) => {
  const { data: currentUser } = useGetCurrentUser();
  const likesList = post?.likes?.map((user: Models.Document) => user.$id) || [];
  const [likes, setLikes] = useState<string[]>(likesList);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { data: isSaved, isPending: isCheckingSavedPost } = useCheckIfSaved(currentUser?.$id || "", post?.$id || "");
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
  
  // ✅ Replace useEffect with TanStack Query Hook
 
  const handleLikePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLikes((prevLikes) => {
        const hasLiked = prevLikes.includes(userId);
        const updatedLikes = hasLiked ? prevLikes.filter((id) => id !== userId) : [...prevLikes, userId];

        likePost({ postId: post?.$id || "", likeArray: updatedLikes });
        return updatedLikes;
      });
    },
    [likePost, post?.$id, userId]
  );

  const handleSavePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
  
      if (isSaved) {
        const savedRecord = currentUser?.saves?.find((save: Models.Document) =>
          save.posts?.some((savedPost: Models.Document) => savedPost.$id === post?.$id)
        );
        const savedRecordId = savedRecord?.$id;
  
        if (savedRecordId) {
          deleteSavedPost(savedRecordId);
        } else {
          console.warn("No saved record found for deletion.");
        }
      } else {
        savePost({ postId: post?.$id || "", userId });
      }
    },
    [deleteSavedPost, savePost, isSaved, currentUser?.saves, post?.$id, userId]
  );
  
  // const testDebugT = savePost({postId: "67bb38e600355e7741bd", userId: "67ba01ad0036692bdc22"});

  // console.log("testing listed document:", testDebugT);
  // const testDebug = debugSavesCollection();

  // console.log("testing listed document:", testDebug);
  // console.log("GET currentUser:", currentUser);
  // console.log("GET currentUser?.saves:", currentUser?.saves);

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isCheckingSavedPost || isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
