import { Routes, Route } from 'react-router-dom';
import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, LikedPosts, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/** Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/** Private Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<EditPost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
          <Route path='/liked-posts' element={<LikedPosts />} />

          {/** Fix for multi-segment splat path */}
          <Route path='/profile/:id'>
            <Route index element={<Profile />} />
            <Route path='*' element={<Profile />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
