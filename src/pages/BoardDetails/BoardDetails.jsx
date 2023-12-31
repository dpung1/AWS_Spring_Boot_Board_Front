import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useNavigate, useParams } from 'react-router-dom';

const SBoradContainer = css`
    position: relative;
    width: 100%;
`;

const SSideOption = css`
    position: absolute;
    right: -75px;
    height: 100%;
`;

const SLikeButton = (isLike) => css`
    position: sticky;
    top: 150px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: ${isLike ? "#ffc0cb" : "#fff"};
    cursor: pointer;
`;

const SBoardTitle = css`
    width: 100%;
    font-size: 50px;
    word-wrap: break-word; // 다음줄로 넘어가고 필요한 경우에 단어의 줄바꿈도 동시에 일어남
    white-space: normal; // normal 기본값, 너비를 초과할 경우 줄바꿈 허용
`;

const SWriteInfoBox = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SButtonBox = css`
    & button {
        margin: 0px 5px;
    }
`;

const SLine = css`
    width: 100%;
    margin: 30px 0px;
    border-bottom: 2px solid #dbdbdb;
`;

const SContentContainer = css`
    width: 100%;
    word-wrap: break-word; 
    & img {
        max-width: 100%;
    }
`;

function BoardDetails(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principal = queryClient.getQueryState("getPrincipal")

    const { boardId } = useParams(); 
    
    const [ board, setBoard ] = useState({});

    const getBoard = useQuery(["getBoard"], async () => {
        try {
            return await instance.get(`/board/${boardId}`);
        } catch(error) {
            console.log(error)
        }
    }, {
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setBoard(response.data)
        }
    })

    const getLikeState = useQuery(["getLikeState"], async () =>{
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get(`/board/like/${boardId}`, option);
        } catch(error) {
            console.log(error)
        }
    }, {
        refetchOnWindowFocus: false,
        retry: 0
    })

    const likeButtonOnClick = async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            if(!!getLikeState?.data.data) {
                await instance.delete(`/board/like/${boardId}`, option);
            } else {
                await instance.post(`/board/like/${boardId}`, {}, option);
            }
            getLikeState.refetch();
            getBoard.refetch();
        } catch(error){
            console.log(error)
        }
    }

    if(getBoard.isLoading) {
        return<></>
    }

    const editButtonOnClick = () => {
        navigate(`/board/${boardId}/edit`)
    }

    const deleteButtonOnClick = async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            if(window.confirm("정말 삭제하시겠습까?")) {
                await instance.delete(`/board/${boardId}`, option);
                alert("삭제되었습니다.")
                navigate("/board/all/1")
            } else {
                alert("삭제가 취소되었습니다.")
            }
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <RootContainer>
            <div css={SBoradContainer}>
                <div css={SSideOption}>
                    {!getLikeState.isLoading && 
                        <button disabled={!principal?.data?.data} css={SLikeButton(getLikeState?.data?.data)} onClick={likeButtonOnClick}>
                            <div>❤️</div>
                            <div>{board.boardLikeCount}</div>
                        </button>
                    }
                </div>
                <h1 css={SBoardTitle}>{board.boardTitle}</h1>
                <div css={SWriteInfoBox}>
                    <p><b>{board.nickname} - {board.createDate}</b></p>
                    {principal?.data?.data?.email === board.email ? (
                        <div css={SButtonBox}>
                            <button onClick={editButtonOnClick}>수정</button>
                            <button onClick={deleteButtonOnClick}>삭제</button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div css={SLine}></div>
                <div css={SContentContainer}dangerouslySetInnerHTML={{__html: board.boardContent}}></div>
            </div>
        </RootContainer>
    );
}

export default BoardDetails;