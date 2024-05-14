// App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <div className="App">
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
