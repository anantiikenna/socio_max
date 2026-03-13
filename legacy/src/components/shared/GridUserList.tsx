import { Models } from "appwrite";
import { Link, useLocation } from "react-router-dom";
import FollowButton from "./FollowButton";
import { IUser } from "@/types";

type AllUserProps = {
    allUsers : Models.DocumentList<Models.Document> | undefined;
    currentUser: Models.Document | IUser;
}

const GridUserList = ({ allUsers, currentUser } : AllUserProps) => {
    const { pathname } = useLocation();
    //console.log('posts:', posts);
    return (
      <ul className={pathname === '/' ?'grid grid-cols-2 gap-5':'flex flex-wrap justify-center gap-7 w-full'}>
        {allUsers?.documents.map((user: Models.Document) => {
          
          return (
            <li key={user.$id} className={pathname === '/' ? 'w-48 h-64 flex flex-col justify-center items-center gap-2 p-5 border-2 rounded-3xl border-[#336d7a]' :' w-64 h-64 flex flex-col justify-center items-center gap-3 p-10 border-2 rounded-3xl border-[#336d7a]'}>
                <Link to={`/profile/${user.$id}`} className="flex flex-col gap-3 items-center"> 
                    <img 
                        src={user.imageUrl || 'assets/images/profile-placeholder.svg'}
                        alt="profile"
                        className="  h-20 w-20 rounded-full" 
                    />
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="body-bold text-center">{user?.name}</h2>
                        <p className=" small-regular text-primary-500 text-center">
                          @{user?.username}
                        </p>
                    </div> 
                </Link>
                <FollowButton targetUserId={user.$id} currentUserId={currentUser.id} />
            </li>
          )
        })}
      </ul>
    )
  }
  

export default GridUserList