import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import Select from 'react-select';
import ReactQuill from 'react-quill';

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

function BoardEdit(props) {
    const navigate = useNavigate()

    const [ boardContent, setBoardContent ] = useState({ 
        title: "",
        content: "",
        categoryId: "",
        categoryName: "",
        boardId: ""
    });

    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]); 
    const [ selectedOptions, setSelectedOptions ] = useState(selectOptions[0]);
    const [ quillRendering, setQuillRendering ] = useState(false)

    
    const queryClient = useQueryClient();
    const principal = queryClient.getQueryState("getPrincipal");
    
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

    useEffect(() =>{
        instance.get("/board/categories")
        .then((response) => {
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
            categoryId: board?.boardCategoryId,
            categoryName: board?.boardCategoryName,
            boardId: boardId
        })
    }, [selectedOptions])
    
    useEffect(() => {
        if(board && board.boardCategoryName) {
            const selectOptionName = selectOptions.find(option => option.label === board.boardCategoryName);
            setSelectedOptions(selectOptionName);

            if(!boardContent.title && !boardContent.content) {
                setBoardContent({
                    ...boardContent,
                    title: board?.boardTitle,
                    content: board?.boardContent
                })
            }
            setQuillRendering(true)
        }

    }, [board, selectOptions])

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

    const editSubmitOnClick = async () => {
        try {
            await instance.put(`/board/${boardId}`, boardContent);
            queryClient.refetchQueries("getPrincipal")
            alert("수정완료")
            navigate(`/board/${boardId}`)
        } catch(error) {
            console.log(error)
        }
    }

    if(getBoard.isLoading) {
        return<></>
    }

    return (
        <RootContainer>
            <div>
                <h1>글 수정하기</h1>
                <div css={SCategoryContainer}>
                    <div css={SSelectBox}>
                        <Select options={selectOptions} onChange={selectOnChange} value={selectedOptions}/>
                    </div>
                    <button onClick={categoryAddOnClick}>카테고리 추가</button>
                </div>
                <div>
                    <input css={STitleInput} type='text' name='title' placeholder='제목' onChange={titleInputChange} defaultValue={board.boardTitle}/>
                </div>
                <div>
                    {quillRendering 
                    ? (<ReactQuill style={{width: "727px", height: "500px"}} modules={modules} onChange={contentInputOnChange} defaultValue={board.boardContent}/>)
                    : null
                    }
                </div>
                <div css={SbuttonBox}>
                    <button onClick={editSubmitOnClick}>수정하기</button>
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardEdit;