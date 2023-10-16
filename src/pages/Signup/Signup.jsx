import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/config/instance';

const SLayout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`


function Signup(props) {
    const navigate = useNavigate();
    const user = { 
        email: "",
        password: "",
        name: "",
        nickname: ""
    }

    const [ signupUser, setSignupUser ] = useState(user);

    const inputOnChange = (e) => {
        setSignupUser({
            ...signupUser,
            [e.target.name]: e.target.value
        })
    }

    const signinOnClick = () => {
        navigate("/auth/signin")
    }

    const signupSubmitOnClick = async () => {
        try {
            const response = await instance.post("/auth/signup", signupUser);
            console.log(response.data);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div css={SLayout}>
            <div><input type='email' name='email' placeholder='이메일' onChange={inputOnChange}/></div>
            <div><input type='password' name='password' placeholder='비밀번호' onChange={inputOnChange}/></div>
            <div><input type='text' name='name' placeholder='이름' onChange={inputOnChange}/></div>
            <div><input type='text' name='nickname' placeholder='닉네임' onChange={inputOnChange}/></div>
            <div><button onClick={signupSubmitOnClick}>가입하기</button></div>
            <div><button onClick={signinOnClick}>로그인</button></div>
        </div>
    );
}

export default Signup;