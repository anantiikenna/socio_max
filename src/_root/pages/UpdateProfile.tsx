import ProfileForm from "@/components/forms/ProfileForm";
import { useUserContext } from "@/context/useUserContext";

const UpdateProfile = () => {

  
  const { user } = useUserContext(); 

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className=' max-w-5xl flex-start gap-3 justify-start w-full'>
          <img 
            src='/assets/icons/add-post.svg'
            width={36}
            height={36}
            alt="Edit Post"
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit</h2>
        </div>
        
        <ProfileForm user={user} action='Update'  />
      </div>
    </div>
  )

}

export default UpdateProfile;
