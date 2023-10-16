import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';

const SLayout = css`
    margin-right: 10px;
    width: 320px;
`;

const SContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`;

function SideBar(props) {
    const navigate = useNavigate();

    const signinOnClick = () => {
        navigate("/auth/signin");
    }

    return (
        <div css={SLayout}>
            <div css={SContainer}>
                <h3>로그인 후 게시판을 이용해보세요</h3>
                <div><button onClick={signinOnClick}>로그인</button></div>
                <div>
                    <Link to={"/auth/forgot/password"}>비밀번호 찾기</Link>
                    <Link to={"/auth/signup"}>회원가입 찾기</Link>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
