import React, { useEffect } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useNavigate } from 'react-router-dom';

const SStoreContainer = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`;

const SProductContainer = css`
    margin: 10px;
    width: 30%;
    height: 120px;
    cursor: pointer;
`;

function PointStore(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const getProducts = useQuery(["getProducts"], async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get("/products", option)
        } catch(error) {
            console.log(error)
        }
    });

    useEffect(() => {
        const iamprot = document.createElement("script");
        iamprot.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamprot);
        return () => {
            document.head.removeChild(iamprot);
        }
    }, [])

    const paymentSubmit = (product) => {
        const principal = queryClient.getQueryState("getPrincipal")
        if(!window.IMP) {return} 
        const { IMP } = window;
        IMP.init("imp31774216");

        const paymentData = {
            pg: "kakaopay",
            pay_method: "kakaopay",
            merchant_uid: `mid_${new Date().getTime()}`, // 구매자 식별코드(결제날,시간)
            amount: product.productPrice, // 금액
            name: product.productName, // 상품이름
            buyer_name: principal?.data?.data?.name, // 구매자 이름
            buyer_email: principal?.data?.data?.email
        }

        IMP.request_pay(paymentData, (response) => {
            const { success, error_msg } = response;

            if(success) {
                // 우리 서버에 주문 데이터 insert
                const orderData = {
                    productId: product.productId,
                    email: principal?.data?.data?.email
                }
                const option = { 
                    headers: {
                        Authorization: localStorage.getItem("accessToken")
                    }
                }
                instance.post("/order", orderData, option)
                .then(response => {
                    alert("포인트 충전이 완료되었습니다.");
                    queryClient.refetchQueries(["getPrincipal"]);
                    navigate("/account/mypage")
                })
            } else {
                alert(error_msg)
            }
        });
    }

    return (
        <RootContainer>
            <h1>포인트 충전하기</h1>
            <div css={SStoreContainer}>
                    {!getProducts.isLoading && getProducts?.data?.data.map(product => {
                        return <button key={product.productId} css={SProductContainer} onClick={() =>{paymentSubmit(product)}}>
                                    {product.productName} Point
                                </button>
                    })}
                    
                    
            </div>
    </RootContainer>
    );
}

export default PointStore;