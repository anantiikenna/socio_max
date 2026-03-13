import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/useUserContext";
import Logo from "@/components/shared/Logo";



const SignupForm = () => {

  const {toast} = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate  = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();

  const { mutateAsync: signInAccount }  = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values.
    //Create new user 
    const newUser = await createUserAccount(values);
      console.log(newUser);
    
    if(!newUser){
      return toast({ title: 'Sign up failed. Please try again.' })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if(!session){
      return toast({ title: "Couldn't log you in."})
    }

    const isLoggedIn = await checkAuthUser(); 
    if (isLoggedIn) {
      form.reset();
      navigate('/');
      return toast({title:'Welcome! You are now logged in!'});
    } else {
      return toast({ 
        variant: "destructive",
        title: 'Sign up failed. Please try again.' 
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col" >
        <Logo />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-7" > Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-7" >
          To use SocioMax, please enter your account details
        </p>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col gap-5 w-full mt-4"
        >
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser || isUserLoading ? (
              <div className=" flex-center gap-2">
                <Loader /> Loading...
              </div>
            ): 'Sign Up'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2" >
            Already have an account? 
            <Link to='/sign-in' className='text-primary-500 text-small-semi-bold ml-1'>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm