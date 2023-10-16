import React from 'react';
import Header from '../Header/Header';
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const SLayout = css`
    margin: 20px auto;
    width: 1100px;

`;

function RootLayout({ children }) {
    return (
        <div css={SLayout}>
            <Header />
            {children}
        </div>
    );
}

export default RootLayout;