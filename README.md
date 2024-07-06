* * *

SocioMax
========

SocioMax is a social media platform designed to connect people and foster interactions. Users can sign up, log in, create profiles, and share posts with their network.

Table of Contents
-----------------

*   [Features](#features)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Authentication](#authentication)
*   [Dependencies](#dependencies)
*   [Contributing](#contributing)
*   [License](#license)

Features
--------

*   **User Authentication**: Sign-up and sign-in functionalities.
*   **Profile Management**: Users can create and update their profiles.
*   **Post Creation**: Users can create, view, and manage their posts.
*   **Infinite Scroll**: Efficiently load more posts as the user scrolls.

Installation
------------

1.  **Clone the repository**:
    
    sh
    
    Copy code
    
    `git clone https://github.com/yourusername/sociomax.git cd sociomax`
    
2.  **Install dependencies**:
    
    sh
    
    Copy code
    
    `npm install`
    
3.  **Set up environment variables**:
    
    Create a `.env` file in the root directory and add the following variables:
    
    sh
    
    Copy code
    
    `REACT_APP_API_ENDPOINT=your_api_endpoint REACT_APP_APPWRITE_PROJECT_ID=your_appwrite_project_id`
    
4.  **Run the app**:
    
    sh
    
    Copy code
    
    `npm start`
    

Usage
-----

### Sign-Up

To sign up, navigate to the sign-up page and fill in the required details. Once registered, you will be redirected to the sign-in page.

### Sign-In

To sign in, navigate to the sign-in page, enter your email and password, and submit the form. Upon successful authentication, you will be redirected to the homepage.

### Creating Posts

After signing in, you can create new posts by clicking on the "New Post" button and filling in the necessary details.

Authentication
--------------

### Context and Hooks

SocioMax uses React Context and Hooks to manage authentication states. Below is a brief explanation of how it works:

*   **AuthProvider.tsx**: This file defines the `AuthProvider` component, which wraps around the application to provide authentication context.
*   **useUserContext.ts**: Custom hook to access the authentication context.
*   **SignInForm.tsx**: Component for handling user sign-in.
*   **SignUpForm.tsx**: Component for handling user sign-up.

### Code Snippets

#### AuthProvider.tsx

tsx

Copy code

`import { getCurrentUser } from '@/lib/appwrite/api'; import { IContextType, IUser } from '@/types'; import { createContext, useEffect, useState } from 'react'; import { useNavigate } from 'react-router-dom';  // ... (code omitted for brevity)`

#### SignInForm.tsx

tsx

Copy code

`import { SigninValidation } from "@/lib/validation"; import { zodResolver } from "@hookform/resolvers/zod"; import { useForm } from "react-hook-form"; // ... (code omitted for brevity)`

Dependencies
------------

*   **React**: A JavaScript library for building user interfaces.
*   **React Router**: Declarative routing for React.
*   **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
*   **Zod**: A TypeScript-first schema declaration and validation library.
*   **Appwrite**: Open-source backend as a service.

Contributing
------------

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push your changes to your feature branch.
5.  Create a pull request.

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.

* * *
