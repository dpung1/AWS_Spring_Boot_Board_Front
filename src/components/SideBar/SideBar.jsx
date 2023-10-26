import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';

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
    const [ categories, setCategories ] = useState([]);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const principalState = queryClient.getQueryState("getPrincipal")

    useEffect(() =>{
        instance.get("/board/categories")
        .then((response) => {
            setCategories(response.data)

            const nums = [1,2,3,4,5];
            const result = nums.reduce((sum, curValue) => {
                return sum + curValue;
            }, 0)
        })
    }, [])

    const signinOnClick = () => {
        navigate("/auth/signin");
    }

    const LogoutOnClick = () => {
        localStorage.removeItem("accessToken");
        window.location.replace("/")
        // 페이지가 새로 열림 (상태 삭제)
    }

    return (
        <div css={SLayout}>
            {!!principalState?.data?.data ? ( 
                <div css={SContainer}>
                    <h3>{principalState.data.data.nickname}님 환영합니다.</h3>
                    <div><button onClick={LogoutOnClick}>로그아웃</button></div>
                    <div>
                        <Link to={"/account/mypage"}>마이페이지</Link>
                    </div>
                </div>
            ) : ( 
                <div css={SContainer}>
                    <h3>로그인 후 게시판을 이용해보세요</h3>
                    <div><button onClick={signinOnClick}>로그인</button></div>
                    <div>
                        <Link to={"/auth/forgot/password"}>비밀번호 찾기</Link>
                        <Link to={"/auth/signup"}>회원가입 찾기</Link>
                    </div>
                </div>
            )}
            <div>
                <ul>
                    <Link to={"/board/write"}><li>글쓰기</li></Link>
                    <Link to={"/board/all/1"}><li>전체 게시글 ({categories.map(category => category.boardCount).reduce((sum, curValue) => sum + curValue, 0)})</li></Link>
                    {categories.map(category => {
                        return <Link key={category.boardCategoryId} to={`/board/${category.boardCategoryName}/1`} reloadDocument={true}>
                                    <li>
                                        {category.boardCategoryName} ({category.boardCount})
                                    </li>
                                </Link>
                    })}
                </ul>
            </div>
        </div>

        
    );
}

export default SideBar;
