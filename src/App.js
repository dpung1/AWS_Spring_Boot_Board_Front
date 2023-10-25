import './App.css';
import { Route, Routes } from 'react-router-dom';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './pages/Home/Home';
import { useQuery } from 'react-query';
import { instance } from './api/config/instance';
import AuthRoute from './components/Routes/AuthRoute';
import Mypage from './pages/Mypage/Mypage';
import AccountRoute from './components/Routes/AccountRoute';
import BoardWrite from './pages/BoardWrite/BoardWrite';
import BoardList from './pages/BoardList/BoardList';

function App() {
  // useQuery = 무조건 get 요청
  const getPrincipal = useQuery(["getPrincipal"], async () => {
    try {
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }

      return await instance.get("/account/principal", option);

    } catch(error) {
      throw new Error(error)
    }
  }, {
    retry: 0,
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });

  if(getPrincipal.isLoading) {
    return <></>
  }

  return (
    <RootLayout>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/auth/*' element={ <AuthRoute /> }/>
        <Route path='/account/*' element={ <AccountRoute /> }/>
        <Route path='/board/write' element={ <BoardWrite /> }/>
        <Route path='/board/:category/:page' element={ <BoardList /> }/>
        <Route path='/board/:category/edit' element={<></>}/>
      </Routes>
    </RootLayout>
  );
}

export default App;
