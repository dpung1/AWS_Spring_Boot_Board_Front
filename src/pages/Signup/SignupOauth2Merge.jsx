import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
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

function SignupOauth2Merge(props) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ mergeUser, setMergeUser ] = useState({
        email: searchParams.get("email"),
        password: "",
        oauth2Id: searchParams.get("oauth2Id"),
        provider: searchParams.get("provider")
    });

    const inputChangeOnClick = (e) => {
        setMergeUser({
            ...mergeUser,
            [e.target.name]: e.target.value
        })
        console.log(mergeUser)
    }

    const mergeSubmitOnClick = async () => {
        try {
            await instance.put("/auth/oauth2/merge", mergeUser);
            window.location.replace("/auth/signin")
        } catch(error) {
            alert(error.response.data.authError)
        }
    }

    return (
        <div css={SLayout}>
            <h1>{searchParams.get("email")} 계정과 {searchParams.get("provider")} 계정 통합</h1>
            <p>계정을 통합하시라면 가입된 사용자의 비밀번호를 입력하세요.</p>
            <div css={SInputBox}>
                <input type='password' name='password' placeholder='비밀번호' onChange={inputChangeOnClick}/>
            </div>
            <button css={SButton} onClick={mergeSubmitOnClick}>확인</button>
        </div>
    );
}

export default SignupOauth2Merge;