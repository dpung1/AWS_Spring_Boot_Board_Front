import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../../api/config/instance';

const SLayout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SInputBox = css`
    margin-top: 5px;
`; 

const SButton = css`
    margin-top: 5px;
    width: 147px;
`;

function SignupOauth2(props) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(!window.confirm("등록되지 않은 간편로그인 사용자입니다. 회원등록 하시겠습니까?")) {
            window.location.replace("/auth/signin");
        }
    }, [])

    const user = { 
        email: "",
        password: "",
        name: searchParams.get("name"),
        nickname: "",
        oauth2Id: searchParams.get("oauth2Id"),
        profileImg: searchParams.get("profileImg"),
        provider: searchParams.get("provider")
    }

    console.log(user);

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
            <div css={SInputBox}><input type='email' name='email' placeholder='이메일' onChange={inputOnChange}/></div>
            <div css={SInputBox}><input type='password' name='password' placeholder='비밀번호' onChange={inputOnChange}/></div>
            <div css={SInputBox}><input type='text' name='name' placeholder='이름' value={signupUser.name} onChange={inputOnChange}/></div>
            <div css={SInputBox}><input type='text' name='nickname' placeholder='닉네임' onChange={inputOnChange}/></div>
            <div><button css={SButton} onClick={signupSubmitOnClick}>가입하기</button></div>
            <div><button css={SButton} onClick={signinOnClick}>로그인</button></div>
        </div>
    );
}

export default SignupOauth2;