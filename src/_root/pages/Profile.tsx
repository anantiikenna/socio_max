import { Route, Routes, Link, Outlet, useParams, useLocation} from "react-router-dom";
import { useUserContext } from "@/context/useUserContext";
import Loader from "@/components/shared/Loader";
import GridPostList2 from "@/components/shared/GridPostList2";
import FollowButton from "@/components/shared/FollowButton";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import FollowStats from "@/components/shared/FollowStats";
import LikedPosts from "./LikedPosts";
import { useEffect, useState } from "react";

const Profile = () => {
  const [showButton, setShowbutton] = useState(true);
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");
  
  console.log( currentUser?.posts );
  console.log( user.id );

  useEffect(() => {
    if (user.id === id) {
    setShowbutton(false);
    }
  }, [showButton, id, user]);
  
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-primary-500 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <FollowStats targetUserId={currentUser.$id}  postlength={currentUser.posts.length} />
          </div>
          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div>
              <FollowButton targetUserId={user.id} currentUserId={currentUser.$id} />
            </div>
          </div>
        </div>
      </div>

      {currentUser.bio &&
        <div className="flex gap-10 : max-xl:justify-center items-center max-w-4xl w-full">
          <h1 className="text-center xl:text-left h3-bold md:h1-semibold ">Bio</h1>
            <p className=" text-center xl:text-left overflow-hidden">
              {currentUser.bio}
            </p>
        </div>
      }
      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList2 posts={currentUser.posts} user={user}/>}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;