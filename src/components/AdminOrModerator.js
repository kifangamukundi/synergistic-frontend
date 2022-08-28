import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminOrModerator({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && (userInfo.isAdmin || userInfo.isModerator) ? children : <Navigate to="/signin" />;
}
