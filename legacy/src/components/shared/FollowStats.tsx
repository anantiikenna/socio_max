import { useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutations";

type FollowButtonProps = {
    targetUserId: string;
    postlength: number;
  };

const FollowStats = ({ targetUserId, postlength }: FollowButtonProps) => {
    const { data: followers, isPending, error } = useGetFollowers(targetUserId);
    const { data: following, isPending: isLoadingFollowing, error:error1 } = useGetFollowing(targetUserId);

    // const { data: currentFollowers, isPending: currentIsPending, error: currentError } = useGetFollowers(currentUserId);
    // const { data: currentFollowing, isPending: currentIsLoadingFollowing, error: currentError1 } = useGetFollowing(currentUserId);
    
// console.log(currentFollowing);
  console.log(following)

  if (isPending) return <p>Loading followers...</p>;
  if (isLoadingFollowing) return <p>Loading following...</p>;
  if (error) return <p>Error loading followers</p>;
  if (error1) return <p>Error loading followers</p>;

    // if (currentIsPending) return <p>Loading followers...</p>;
    // if (currentIsLoadingFollowing) return <p>Loading following...</p>;
    // if (currentError) return <p>Error loading followers</p>;
    // if (currentError1) return <p>Error loading followers</p>;


  // const followersCurrentCount = currentFollowers ? currentFollowers.length : 0;

  // const followingCurrentCount = currentFollowing ? currentFollowing.length : 0;

  const followersCount = followers ? followers.length : 0;

  const followingCount = following ? following.length : 0;

  console.log(followers);

  return (
    <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{postlength}</p>
            <p className="small-medium lg:base-medium text-light-2">Posts</p>
        </div>
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{followersCount}</p>
            <p className="small-medium lg:base-medium text-light-2">Following</p>
        </div>
        <div className="flex-center gap-2">
            <p className="small-semibold lg:body-bold text-primary-500">{followingCount}</p>
            <p className="small-medium lg:base-medium text-light-2">Followers</p>
        </div>
    </div>
    
  )
}

export default FollowStats