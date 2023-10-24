import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { instance } from '../../api/config/instance';

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

    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]); 
    const [ selectedOptions, setSelectedOptions ] = useState(selectOptions[0]);

    useEffect(() =>{
        instance.get("/board/categories")
        .then((response) => {
            setSelectOptions(
                response.data.map(
                    category => {
                        return {value: category.boardCategoryName, label: category.boardCategoryName}
                    }
                )
            )
        })
    }, [])

    useEffect(() => {
        if(!!newCategory) {
            const newOption = { value: newCategory, label: newCategory }

            setSelectedOptions(newOption);
            if(!selectOptions.map(option => option.value).includes(newOption.value)) {
                setSelectOptions([
                    ...selectOptions,
                    newOption
                ]);
            }
        }
    }, [newCategory])

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
        console.log(value)
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
                    <button >작성하기</button>
                </div>
                    
            </div>
        </RootContainer>
    );
}

export default BoardWrite;