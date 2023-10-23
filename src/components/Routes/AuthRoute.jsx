import React from 'react';
import { useQueryClient } from 'react-query';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupOauth2 from '../../pages/Signup/SignupOauth2';

function AuthRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {
        return <Navigate to={"/"} />
    }

    return (
    <Routes>
        <Route path='/signin' element={ <Signin /> }/>
        <Route path='/signup' element={ <Signup />}/>
        <Route path='/oauth2/signup' element={ <SignupOauth2 />}/>
    </Routes>
    );
}

export default AuthRoute;