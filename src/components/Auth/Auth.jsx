import React from 'react';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { Route, Routes } from 'react-router-dom';

function Auth(props) {
    return (
    <Routes>
        <Route path='/signin' element={ <Signin /> }/>
        <Route path='/signup' element={ <Signup />}/>
    </Routes>
    );
}

export default Auth;