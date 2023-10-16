import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SideBar from '../SideBar/SideBar';

const SRootContainer = css`
    display: flex;
    width: 100%;
    height: 100%;
`;

const SMainContainer = css`
    flex-grow: 1;
    height: 100%;
    border: solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`;

function RootContainer({ children }) {
    return (
        <div css={SRootContainer}>
            <SideBar />
            <div css={SMainContainer}>
                {children}
            </div>
        </div>
    );
}

export default RootContainer;