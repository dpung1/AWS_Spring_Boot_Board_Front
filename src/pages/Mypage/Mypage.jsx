import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';



function Mypage(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");
    const principal = principalState.data.data

    const sendMailOnClick = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            } 
            await instance.post("/account/mail/auth", {}, option);
            alert("인증메일 전송 완료. 인증 요청 메일을 확인해주세요.")
        } catch(error) {
            alert("인증메일 전송 실패. 다시 시도해주세요.")
        }
    }

    return (
        <RootContainer>
            <div>
                <div>
                    <img src="" alt="" />
                </div>
                <div>
                    누적 포인트 : 0 Point
                </div>
                <div>
                    <div>닉네임 : {principal.nickname}</div>
                    <div>이름 : {principal.name}</div>
                    <div>
                        이메일 : {principal.email} {principal.enabled 
                        ? <button disabled={true}>인증완료</button>
                        : <button onClick={sendMailOnClick}>인증하기</button>}
                    </div>
                </div>
            </div>
        </RootContainer>
    );
}

export default Mypage;