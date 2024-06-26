import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { AllUsers } from "@/_root/pages";

const RightSidebar = () => {
    const { user } = useUserContext();
    const { data : users } = useGetUsers(10);
  return (
    <div className="rightsidebar">
        <AllUsers />
    </div>
  )
}

export default RightSidebar