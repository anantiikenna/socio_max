import GridUserList from '@/components/shared/GridUserList';
import { useUserContext } from '@/context/AuthContext';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import { useLocation } from 'react-router-dom';

const AllUsers = () => {
  const { user } = useUserContext();
  const { data : users } = useGetUsers(10);
  console.log(users);
  const { pathname } = useLocation();
  return (
    <div className={pathname === "/" ? 'hidden xl:flex flex-col flex-shrink items-center max-w-[500px] min-w-56 gap-10 mt-10' : 'flex flex-col gap-6 flex-1 mt-10'}>
      <div className="explore-inner container">
        <h2 className="h3-bold md:h2-bold w-full">{pathname === "/" ? `Top Creators`:`All Users`}</h2>
      </div>
      <div className="container">
        <GridUserList allUsers={users} currentUser={user} />
      </div>
    </div>
  )
}

export default AllUsers