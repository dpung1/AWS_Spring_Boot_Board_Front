import React from 'react';
import { useQueryClient } from 'react-query';
import Mypage from '../../pages/Mypage/Mypage';
import { Navigate, Route, Routes } from 'react-router-dom';
import EditPassword from '../../pages/EditPassword/EditPassword';

function AccountRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!principalState?.data?.data) {
        alert("로그인 후 이용하시기 바랍니다.")
        return <Navigate to={"/auth/signin"} />
    }

    return (
    <Routes>
        <Route path='mypage' element={ <Mypage /> }/>
        <Route path='password' element={ <EditPassword /> }/>
    </Routes>
    );
}

export default AccountRoute;