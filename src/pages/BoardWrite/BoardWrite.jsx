import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { instance } from '../../api/config/instance';
import { useQueryClient } from 'react-query';

const STitleInput = css`
    margin-bottom: 5px;
    width: 100%;
    height: 35px;
`;

const SCategoryContainer = css`
    display: flex;

    margin-bottom: 5px;
`;

const SSelectBox = css`
    flex-grow: 1;
`;

const SbuttonBox = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

function BoardWrite(props) {

    const [ boardContent, setBoardContent ] = useState({
        title: "",
        content: "",
        categoryId: "",
        categoryName: ""
    });

    const [ categories, setCategories ] = useState([]);
    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]); 
    const [ selectedOptions, setSelectedOptions ] = useState(selectOptions[0]);

    const queryClient = useQueryClient();

    useEffect(() => {
        const principal = queryClient.getQueryState("getPrincipal");

        if(!principal.data) {
            alert("로그인 후 게시글을 작성하세요.")
            window.location.replace("/")
            return;
        }
        
        if(!principal?.data?.data.enabled) {
            alert("이메일 인증 후 게시글을 작성하세요.")
            window.location.replace("/account/mypage")
        }
    }, [])

    useEffect(() =>{
        instance.get("/board/categories")
        .then((response) => {
            setCategories(response.data)
            setSelectOptions(
                response.data.map(
                    category => {
                        return {value: category.boardCategoryId, label: category.boardCategoryName}
                    }
                )
            )
        })
    }, [])

    useEffect(() => {
        if(!!newCategory) {
            const newOption = { value: 0, label: newCategory }

            setSelectedOptions(newOption);
            if(!selectOptions.map(option => option.label).includes(newOption.label)) {
                setSelectOptions([
                    ...selectOptions,
                    newOption
                ]);
            }
        }
    }, [newCategory])

    useEffect(() => {
        setBoardContent({
            ...boardContent,
            categoryId: selectedOptions?.value,
            categoryName: selectedOptions?.label
        })
    }, [selectedOptions])

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, 3, false]}],
                ["bold", "underline"],
                ["image"]
            ]
        }
    }

    const titleInputChange = (e) => {
        setBoardContent({
            ...boardContent,
            title: e.target.value
        });
    }

    const selectOnChange = (option) => {
        setSelectedOptions(option)
    }

    const categoryAddOnClick = () => {
        const categoryName = window.prompt("새로 추가할 카테고리명을 입력하세요.")
        if(!categoryName) {
            return;
        }
        setNewCategory(categoryName);
    }

    const contentInputOnChange = (value) => {
        setBoardContent({
            ...boardContent,
            content: value
        });
    }

    const writeSubmitOnClick = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            console.log(boardContent)
            await instance.post("/board/content", boardContent, option)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <RootContainer>
            <div>
                <h1>글쓰기</h1>
                <div css={SCategoryContainer}>
                    <div css={SSelectBox}>
                        <Select options={selectOptions} onChange={selectOnChange} defaultValue={selectedOptions} value={selectedOptions}/>
                    </div>
                    <button onClick={categoryAddOnClick}>카테고리 추가</button>
                </div>
                <div>
                    <input css={STitleInput} type='text' name='title' placeholder='제목' onChange={titleInputChange}/>
                </div>
                <div>
                    <ReactQuill style={{width: "727px", height: "500px"}} modules={modules} onChange={contentInputOnChange}/>
                </div>
                <div css={SbuttonBox}>
                    <button onClick={writeSubmitOnClick}>작성하기</button>
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardWrite;