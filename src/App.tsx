// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginDetails from './components/login-details/sign-in/LoginDetails';
import Main from './components/main/Main';
import RegisterProduct from './components/register-product/RegisterProduct';
import SearchProduct from './components/search-product/SearchProduct';
import DeleteProduct from './components/search-product/DeleteProduct';
import UpdateProduct from './components/search-product/UpdateProduct';
import AddCategory from './components/add-category/AddCategory';
import AddProductToCategory from './components/add-product-to-category/AddProductToCategory';
import ListCategories from './components/list-categories/ListCategories';
import RegisterAccount from './components/login-details/register-account/RegisterAccount';
import { Button } from '@mui/material';


function App() {

  // State för token som används för att avgöra om användaren är inloggad eller inte. Sätts till null om användaren inte är inloggad och sätts till 
  // token om användaren är inloggad och token finns i localstorage 
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  // Denna useEffect körs när sidan laddas och sätter token i state till token som finns i localstorage om det finns något där för att direkt uppdatera 
  //sidan om användaren är inloggad
  useEffect(() => { 
    setToken(localStorage.getItem('token'));
  }, []);

  // Denna funktionen fungerar som en callback som skickas till LoginDetails.tsx och körs därifrån när användaren loggar in och skickar tillbaka ett 
  //token som sätts i localstorage och i state här i App.tsx
  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <BrowserRouter basename='ProductManagerFrontEnd'>
        <Routes>
          <Route
            path="/"
            element={<LoginDetails onLogin={(newToken: string) => handleLogin(newToken)} />}
          />
          <Route path="/RegisterAccount" element={<RegisterAccount />} />
          {token && <Route path="/Main" element={<Main />} />}
          {token && <Route path="/RegisterProduct" element={<RegisterProduct />} />}
          {token && <Route path="/SearchProduct" element={<SearchProduct />} />}
          {token && <Route path="/DeleteProduct" element={<DeleteProduct />} />}
          {token && <Route path="/UpdateProduct" element={<UpdateProduct />} />}
          {token && <Route path="/AddCategory" element={<AddCategory />} />}
          {token && <Route path="/AddProductToCategory" element={<AddProductToCategory />} />}
          {token && <Route path="/ListCategories" element={<ListCategories />} />}
        </Routes>
      </BrowserRouter>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleLogout}
        style={{
          height: 44.5,
          width: '200px',
          fontWeight: 'bold',
          textTransform: 'none',
          letterSpacing: '0px',
          margin: '30px auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
          
        }}
      >
        Ta bort token
      </Button>
    </div>
  );
}

export default App;
