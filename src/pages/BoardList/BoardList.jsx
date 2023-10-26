import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import RootContainer from '../../components/RootContainer/RootContainer';
import Select from 'react-select';
import { instance } from '../../api/config/instance';
import { useQuery } from 'react-query';



const SSearchBox = css`
    display: flex;
    justify-content: flex-end;

    margin-bottom: 10px;
    width: 100%;

    & > * {
        margin-left: 5px;
    }
`;

const STable = css`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #dbdbdb;

    & th, td {
        border: 1px solid #dbdbdb;
        height: 30px;
        text-align: center;
    }

    & td {
        cursor: pointer;
    }
`;

const SSelectBox = css`
    width: 150px;
`;

const SPageNumbersBox = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SPageNumbers = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding-right: -40px;
    width: 200px;

    & button {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0px 3px;
        width: 20px;
        border: 1px solid #dbdbdb;
        cursor: pointer;
    }
`;


function BoardList(props) {
    const navigate = useNavigate();
    const { category, page } = useParams();

    const options = [
        {value: "전체", label: "전체"},
        {value: "제목", label: "제목"},
        {value: "작성자", label: "작성자"}
    ]

    const search = {
        optionName: options[0].label,
        searchValue: ""
    }

    const [ searchParams, setSearchParams ] = useState(search);
    
    const searchOptionSelectOnChange = (option) => {
        setSearchParams({
            ...searchParams,
            optionName: option.label
        })
    }

    const searchInputOnChange = (e) => {
        setSearchParams({
            ...searchParams,
            searchValue: e.target.value
        })
    }

    const searchButtonOnClick = () => {
        navigate(`/board/${category}/1`);
        getBoardList.refetch();
        getBoardCount.refetch();
    }

    const getBoardList = useQuery(["getBoardList", page, category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/${page}`, option)
    }, {
        refetchOnWindowFocus: false
    });

    const getBoardCount = useQuery(["getBoardCount", page, category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/count`, option)
    }, {
        refetchOnWindowFocus: false
    })

    const pageNation = () => {
        if(getBoardCount.isLoading) {
            return<></>
        }
        
        const totalBoardCount = getBoardCount.data.data
        
        const lastPage = totalBoardCount % 10 === 0
            ? totalBoardCount / 10
            : Math.floor(totalBoardCount / 10) + 1

        const startIndex = parseInt(page) % 5 === 0 
            ? parseInt(page) - 4
            : parseInt(page) - (parseInt(page) % 5) + 1;

        const endIndex = startIndex + 4 <= lastPage 
            ? startIndex + 4
            : lastPage

        const pageNumbers = [];

        for(let i = startIndex; i <= endIndex; i++) {
            pageNumbers.push(i);
        }
        
        return (
        <>
            <button disabled={parseInt(page) === 1} 
                    onClick={() => {navigate(`/board/${category}/${parseInt(page) - 1}`)}}>
                    &#60;
            </button>

            {pageNumbers.map(num => {
                return <button key={num} onClick={() => {navigate(`/board/${category}/${num}`)}}>
                        {num}
                    </button>
            })}

            <button disabled={parseInt(page) === lastPage} 
            onClick={() => {navigate(`/board/${category}/${parseInt(page) + 1}`)}}>
                &#62;
            </button>
        </>
        )
    }

    return (
        <RootContainer>
            <h1>{category === "all" ? "전체 게시글" : category}</h1>

            <div css={SSearchBox}>
                <div css={SSelectBox}>
                    <Select options={options} defaultValue={options[0]} onChange={searchOptionSelectOnChange}/>
                </div>
                <input type="text" onChange={searchInputOnChange}/>
                <button onClick={searchButtonOnClick}>검색</button>
            </div>
            <table css={STable}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>게시글</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>추천</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {!getBoardList.isLoading && getBoardList?.data.data.map(board => {
                        return <tr key={board.boardId}>
                                    <td>{board.boardId}</td>
                                    <td>{board.title}</td>
                                    <td>{board.nickname}</td>
                                    <td>{board.createDate}</td>
                                    <td>{board.likeCount}</td>
                                    <td>{board.hitsCount}</td>
                                </tr>
                    })}
                </tbody>
            </table>
            <div css={SPageNumbersBox}>
                <div css={SPageNumbers}>
                    {pageNation()}
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardList;

