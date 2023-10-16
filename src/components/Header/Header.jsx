import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

const SHeader = css`
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 10px 0px;
    border: 1px solid #dbdbdbdb;
    border-radius: 10px;
    width: 100%;
    height: 80px;
    
& >  a {
    color: black;
    text-decoration: none;
}

`;


function Header(props) {

    return (
        <div css={SHeader}>
            <Link to={"/"}><h1>게시판 프로젝트</h1></Link>
        </div>
    );
}

export default Header;