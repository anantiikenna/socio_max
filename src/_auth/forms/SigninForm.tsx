import { SigninValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Logo from "@/components/shared/Logo";



const SigninForm = () => {

  const {toast} = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate  = useNavigate();

  

  const { mutateAsync: signInAccount, isPending: isSigningIn }  = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // Do something with the form values.
    
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if(!session){
      return toast({ title: "Session Sign in failed. Please try again."})
    }

    const isLoggedIn = await checkAuthUser(); 
    if (isLoggedIn) {
      form.reset();
      navigate('/');
      return toast({title:'Welcome! You are now logged in!'});
    } else {
      return toast({ title: 'Sign up failed. Please try again.' });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col" >
        <Logo />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-7" > Log in to your account </h2>
        <p className="text-primary-600 small-medium md:base-regular mt-7" >
          To use SocioMax, please enter your account details
        </p>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col gap-5 w-full mt-4"
        >
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
            {isSigningIn ? (
              <div className=" flex-center gap-2">
                <Loader /> Loading...
              </div>
            ): 'Sign In'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2" >
            Don't have an account? 
            <Link to='/sign-up' className='text-primary-500 text-small-semi-bold ml-1'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm