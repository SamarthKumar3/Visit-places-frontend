import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/Context-auth/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const Users = React.lazy(() => import("./user/pages/Users"));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Authorize = React.lazy(() => import('./user/pages/Auth'));


const App = () => {

  const { token, login, logout, userId } = useAuth();

  let way;

  if (token) {
    way = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/places/:placeId' element={<UpdatePlace />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    )
  }
  else {
    way = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Authorize />} />
        <Route
          path="*"
          element={<Navigate to="/auth" replace />}
        />
      </Routes>
    )
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}>
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className='center'><LoadingSpinner /></div>}>
            {way}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider >
  );
};

export default App;
