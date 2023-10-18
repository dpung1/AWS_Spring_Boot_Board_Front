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
const SInputBox = css`
    margin-top: 5px;
`; 

const SButton = css`
    margin-top: 5px;
    width: 147px;
`;

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

    const signinSubmitOnClick = async () => {
        try {
            const response = await instance.post("/auth/signin", signinUser);
            localStorage.setItem("accessToken", "Bearer " + response.data);
            window.location.replace("/")
        } catch(error) {
            if(error.response.status == 401) {
                alert(error.response.data.authError);
            } 
        }
    }

    return (
        <div css={SLayout}>
            <div css={SInputBox}><input type='email' name='email' onChange={inputOnChange} placeholder='이메일'/></div>
            <div css={SInputBox}><input type='password' name='password' onChange={inputOnChange} placeholder='비밀번호'/></div>
            <div><button css={SButton} onClick={signinSubmitOnClick}>로그인</button></div>
            <div><button css={SButton} onClick={signupOnClick}>회원가입</button></div>
        </div>
    );
}

export default Signin;