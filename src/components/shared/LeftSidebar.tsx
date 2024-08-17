import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/useUserContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Logo from "./Logo";


const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { pathname } = useLocation();

    useEffect (() => {
        if( isSuccess ) navigate(0);
    },[isSuccess, navigate])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to={'/'} className="flex items-center gap-1 ml-[-75px]">
          <Logo width={170} height={36} />
        </Link>
      
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center"> 
          <img 
            src={user.imageUrl || 'assets/images/profile-placeholder.svg'}
            alt="profile"
            className=" h-14 w-14 rounded-full" 
          />
          <div className="flex flex-col">
            <h2 className="body-bold">{user?.name}</h2>
            <p className=" small-regular text-primary-500">
              @{user?.username}
            </p>
          </div> 
        </Link>
       
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li 
              key={link.label} 
              className={isActive ? 'bg-primary-500 group leftsidebar-link':'group leftsidebar-link'}>
                <NavLink 
                  to={link.route}
                  className='flex gap-4 items-center p-4'
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={isActive ? 'invert-white'  :" group-hover:invert-white"}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button variant='ghost' className="shad-button_ghost items-center" onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar