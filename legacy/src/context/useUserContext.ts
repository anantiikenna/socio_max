import { useContext } from 'react';
import  {AuthContext}  from './AuthProvider';

export const useUserContext = () => useContext(AuthContext);