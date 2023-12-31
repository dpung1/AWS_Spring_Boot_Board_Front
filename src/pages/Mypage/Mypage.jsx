import React, { useEffect, useRef, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../api/firebase/firebase" 
import { Line } from 'rc-progress'; 
import { Link, useNavigate } from 'react-router-dom';

const SInfoHeader = css`
    display: flex;
    align-items: center;

    margin: 10px;
    border:  1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`;

const SInfoBox = css`
    display: flex;
    align-items: center;
`;

const SImgBox = css`
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 20px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    & > img {
        width: 100%;
    }
`;

const SFile = css`
    display: none;
`;

const SPointBuy = css`
    margin-left: 5px;
    cursor: pointer;
`

function Mypage(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");
    const principal = principalState.data.data
    const profileFileRef = useRef();
    const [ uploadfiles, setUploadFiles ] = useState([]);
    const [ profileImgSrc, setProfileImgSrc ] = useState(""); 
    const [ progressPercent, setProgressPercent ] = useState(0);
    const getPrincipal = useQuery(["getPrincipal"], async () => {
        try {
            const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
            }
          return await instance.get("/account/principal", option); // 리턴을 안걸어주면 데이터 안들어감
    
        } catch(error) {
            throw new Error(error)
        }
        }, {
        retry: 0, // 요청반복횟수
        refetchInterval: 1000 * 60 * 10, // 10분마다 토큰을 자동으로 요청보내서 유효하면 user정보를 가져오게함
        refetchOnWindowFocus: false // 포커스 움직일때마다 useQuery 랜더링 끄기
        });

    useEffect(() => {
        setProfileImgSrc(principal.profileUrl)
    }, [])

    const profileUploadOnClick = () => {
        if(window.confirm("프로필 사진을 변경하시겠습니까?")) {
            profileFileRef.current.click();
        }
    }

    if(getPrincipal.isLoading){
        return <></>
    }

    console.log(principal);

    const profileFileOnChange = (e) => {
        const files = e.target.files;

        if(!files.length) {
            setUploadFiles([]);
            e.target.valuse = "";
            return;
        }

        for(let file of files) {
            setUploadFiles([...uploadfiles, files[0]]);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgSrc(e.target.result)
        }

        reader.readAsDataURL(files[0])
    }

    const uploadSubmitOnClick = () => {
        const storageRef = ref(storage, `files/profile/${uploadfiles[0].name}`)
        const uploadTask = uploadBytesResumable(storageRef, uploadfiles[0]);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgressPercent(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                )
            },
            (error) => {
                console.error(error)
            },
            () => {
                getDownloadURL(storageRef).then(downloadUrl => {

                    const option = {
                        headers: {
                            Authorization: localStorage.getItem("accessToken")
                        }
                    }
                    instance.put("/account/profile/img", {profileUrl: downloadUrl}, option)
                    .then((response) => {
                        alert("프로필 사진이 변경되었습니다.");
                        window.location.reload();
                    })
                })
            }
        )
    };

    const uploadCancelOnClick = () => {
        setUploadFiles([]);
        profileFileRef.current.value = "";
    };


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
                <div css={SInfoHeader}>
                    <div css={SInfoBox}>
                        <div css={SImgBox} onClick={profileUploadOnClick}>
                            <img src={profileImgSrc} alt="" />
                        </div>
                        <input css={SFile} type='file' onChange={profileFileOnChange} ref={profileFileRef}/>
                        <div>
                        {!!uploadfiles.length &&
                            <div>
                                <Line percent={progressPercent} strokeWidth={4} strokeColor="#dbdbdb"/>
                                <button onClick={uploadSubmitOnClick}>변경</button>
                                <button onClick={uploadCancelOnClick}>취소</button>
                            </div>
                        }
                        </div>
                            <h3>누적 포인트 : {principal.userPoint} Point</h3>
                            <button css={SPointBuy} onClick={() => {navigate("/store/products")}}>포인트 구매</button>
                    </div>
                </div>
                <div>
                    <div>닉네임 : {principal.nickname}</div>
                    <div>이름 : {principal.name}</div>
                    <div>
                        이메일 : {principal.email} {principal.enabled 
                        ? <button disabled={true}>인증완료</button>
                        : <button onClick={sendMailOnClick}>인증하기</button>}
                    </div>
                    <Link to={"/account/password"}>비밀번호 변경</Link>
                </div>
            </div>
        </RootContainer>
    );
}

export default Mypage;