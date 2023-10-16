import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const SLayout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`

function Signin(props) {
    const navigate = useNavigate();

    const user = {
        email: "",
        password: ""
    }

    const [ signinUser, setSigninUser ] = useState(user);

    const inputOnChange = (e) => {
        setSigninUser({
            ...signinUser,
            [e.target.name]: e.target.value
        });
    }

    const signupOnClick = () => {
        navigate("/auth/signup")
    }

    return (
        <div css={SLayout}>
            <div><input type='email' name='email' onChange={inputOnChange} placeholder=''/></div>
            <div><input type='password' name='password' onChange={inputOnChange} placeholder=''/></div>
            <div><button>로그인</button></div>
            <div><button onClick={signupOnClick}>회원가입</button></div>
        </div>
    );
}

export default Signin;