import React, { useEffect, useState, useCallback } from "react";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes?.map((user: Models.Document) => user.$id) || [];

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  const handleLikePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      setLikes((prevLikes) => {
        const hasLiked = prevLikes.includes(userId);
        const updatedLikes = hasLiked
          ? prevLikes.filter((id) => id !== userId)
          : [...prevLikes, userId];

        likePost({ postId: post?.$id || "", likeArray: updatedLikes });
        return updatedLikes;
      });
    },
    [likePost, post?.$id, userId]
  );

  const handleSavePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (savedPostRecord) {
        setIsSaved(false);
        deleteSavedPost(savedPostRecord.$id);
      } else {
        savePost({ postId: post?.$id || "", userId });
        setIsSaved(true);
      }
    },
    [deleteSavedPost, savePost, savedPostRecord, post?.$id, userId]
  );

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
        {isSavingPost || isDeletingSaved ? (
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
