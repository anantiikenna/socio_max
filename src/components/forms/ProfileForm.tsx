import { z } from 'zod';
import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { useToast } from "../ui/use-toast";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { EditProfileValidation } from '@/lib/validation';
import { IUser } from '@/types';


type PostFormProps = {
  user?: Models.Document | IUser;
  action: 'Update';
}

const ProfileForm = ( {  user, action }: PostFormProps ) => {
  
 
    const {toast} = useToast();
    const navigate  = useNavigate();
  
    const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  
    // 1. Define your form.
    const form = useForm<z.infer<typeof EditProfileValidation>>({
      resolver: zodResolver(EditProfileValidation),
      defaultValues: {
        name: user? user.name  : '',
        file: [],
        bio: user? user.bio : '',
      },
    })
  
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof EditProfileValidation>) {
      if(user && action === 'Update') {
        const updatedUser = await updateUser({
          ...values,
          userId:  user?.id,
          imageId: user.imageId,
          imageUrl: user?.imageUrl,
        })

        if(!updatedUser ) {
          toast({ title: 'Please try again' });
        }

        return navigate(`/profile/${user.id}`);
      }

    }
  
    return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col" >
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12" > Edit Profile</h2>
          <p className="text-light-3 small-medium md:base-regular mt-12" >
           Update your profile information
          </p>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                <FormLabel className="shad-form_label">Add Photo </FormLabel>
                <FormControl>
                    <FileUploader 
                      fieldChange={field.onChange}
                      mediaUrl={user?.imageUrl}
                    />
                </FormControl>
                <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type='text' className="shad-input" {...field} />
                  </FormControl>               
                  <FormMessage />
                </FormItem>
              )}
            />          
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                <FormLabel className="shad-form_label">bio</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea custom-scrollbar"  {...field} />
                </FormControl>
                <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center justify-end">
              <Button type="button" className="shad-button_dark_4">Cancel</Button>
              <Button type="submit"  className="shad-button_primary whitespace-nowrap" disabled={isUpdatingUser}>
                {isUpdatingUser && 'Loading...'}
                {action} Profile
              </Button>
            </div>
            
          </form>
        </div>
      </Form>
    )
}

export default ProfileForm