import { useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutations";

type FollowButtonProps = {
    targetUserId: string;
    currentUserId: string;
    postlength: number;
  };

const FollowStats = ({ targetUserId, currentUserId, postlength }: FollowButtonProps) => {
    const { data: followers, isPending, error } = useGetFollowers(targetUserId);
    const { data: following, isPending: isLoadingFollowing, error:error1 } = useGetFollowing(targetUserId);

    const { data: currentFollowers, isPending: currentIsPending, error: currentError } = useGetFollowers(currentUserId);
    const { data: currentFollowing, isPending: currentIsLoadingFollowing, error: currentError1 } = useGetFollowing(currentUserId);

    const isFollowing = following?.filter((doc) => doc.followingId === targetUserId);
    const isFollower = followers?.filter((doc) => doc.followerId === targetUserId);

    const isCurrentFollowing = currentFollowing?.filter((doc) => doc.followingId === currentUserId);
    const isCurrentFollower = currentFollowers?.filter((doc) => doc.followerId === currentUserId);

    if (isPending) return <p>Loading followers...</p>;
    if (isLoadingFollowing) return <p>Loading following...</p>;
    if (error) return <p>Error loading followers</p>;
    if (error1) return <p>Error loading followers</p>;

    if (currentIsPending) return <p>Loading followers...</p>;
  if (currentIsLoadingFollowing) return <p>Loading following...</p>;
  if (currentError) return <p>Error loading followers</p>;
  if (currentError1) return <p>Error loading followers</p>;


  const followersCurrentCount = isCurrentFollower ? isCurrentFollower.length : 0;

  const followingCurrentCount = isCurrentFollowing ? isCurrentFollowing.length : 0;

  const followersCount = isFollower ? isFollower.length : 0;

  const followingCount = isFollowing ? isFollowing.length : 0;

  return (
    <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{postlength}</p>
            <p className="small-medium lg:base-medium text-light-2">Posts</p>
        </div>
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{currentUserId === targetUserId ? followersCurrentCount  :followingCount}</p>
            <p className="small-medium lg:base-medium text-light-2">Following</p>
        </div>
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{currentUserId === targetUserId ? followingCurrentCount :followersCount}</p>
            <p className="small-medium lg:base-medium text-light-2">Followers</p>
        </div>
    </div>
    
  )
}

export default FollowStats