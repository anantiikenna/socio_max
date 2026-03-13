import React, { useEffect, useState } from "react";
import { useFollowUser, useUnfollowUser, useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import { Button } from "../ui/button";

type FollowButtonProps = {
  targetUserId: string;
  currentUserId: string;

};

const FollowButton = ({ targetUserId, currentUserId }: FollowButtonProps) => {
  const [showButton, setShowbutton] = useState(true);
  const { data: followers } = useGetFollowers(targetUserId);
  const { data: following } = useGetFollowing(currentUserId);
  
  const isFollowing = following?.some((doc) => doc.followingId === targetUserId);

  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  
  const { mutate: followUser, isPending: isFollowingUser } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowingUser } = useUnfollowUser();

  useEffect(() => {
    if (targetUserId === currentUserId) {
      setShowbutton(false);
      }
    setIsFollowingState(isFollowing);
  }, [isFollowing, showButton, currentUserId, targetUserId]);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowingState) {
      unfollowUser({ followerId: currentUserId, followingId: targetUserId });
    } else {
      followUser({ followerId: currentUserId, followingId: targetUserId });
    }
    setIsFollowingState(!isFollowingState);
    console.log(followers);
  };

  return (
    <div className="flex justify-between items-center z-20">{!showButton ? (<div></div>) : (
      <div>
        {isFollowingUser || isUnfollowingUser ? (<Loader />) : (
        <Button onClick={handleFollow} className="shad-button_primary px-8">
          {isFollowingState ? "Unfollow" : "Follow"}
        </Button>
        )
        }
      </div> 
    )
      }
    </div>
  );
};

export default FollowButton;
