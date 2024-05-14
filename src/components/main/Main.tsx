import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';
import { Dialog, DialogContent } from '@mui/material';
import { DecodedTokenProps } from './Main.types';

const Main = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [messageShown, setMessageShown] = useState(localStorage.getItem('messageShown'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode<DecodedTokenProps>(token);
      setFirstName(decodedToken.given_name);
      setLastName(decodedToken.family_name);
    }

    if (firstName && lastName && !messageShown) {
      setMessage(`Welcome, ${firstName} ${lastName}!`);
      const timer = setTimeout(() => {
        setMessage(null);
        setUsernameLoaded(true);
        setMessageShown('true');
        localStorage.setItem('messageShown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (firstName && lastName && messageShown) {
      setUsernameLoaded(true);
    }
  }, [token, firstName, lastName, messageShown]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('messageShown');
  };


  return (
    <>
      {message && (
        <Dialog 
          open={!!message} 
          maxWidth="sm" 
          fullWidth >
          <DialogContent
            style={{
              backgroundColor: '#2979ff',
              padding: '30px 0 30px 0',
              borderRadius: 5,
              margin: '30px auto',
              boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '93%',
              fontWeight: 600,
              color: 'white'
            }}
          >
            <h2>{message}</h2>
          </DialogContent>
        </Dialog>
        
      )}
      {usernameLoaded && (
        <>
          <div
            style={{
              backgroundColor: '#d6d5d5',
              boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
              padding: '30px 0 30px 0',
              width: '30%',
              borderRadius: 5,
              margin: '30px auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            {isAdmin && (
              <div style={{ width: '300px' }}>
                <Button
                  component={Link}
                  to="/RegisterProduct"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    height: 44.5,
                    width: '300px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    letterSpacing: '0px',
                  }}
                >
                  Add Product
                </Button>
              </div>
            )}
              <div style={{ marginTop: '10px', width: '300px' }}>
                <Button
                  component={Link}
                  to="/SearchProduct"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    height: 44.5,
                    width: '300px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    letterSpacing: '0px',
                  }}
                >
                  Search Product
                </Button>
              </div>
              {isAdmin && (
                <div style={{ marginTop: '10px', width: '300px' }}>
                  <Button
                    component={Link}
                    to="/AddCategory"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{
                      height: 44.5,
                      width: '300px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      letterSpacing: '0px',
                    }}
                  >
                    Add Category
                  </Button>
                </div>
              )}
              { isAdmin && (
                <div style={{ marginTop: '10px', width: '300px' }}>
                  <Button
                    component={Link}
                    to="/AddProductToCategory"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{
                      height: 44.5,
                      width: '300px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      letterSpacing: '0px',
                    }}
                  >
                    Add Product to Category
                  </Button>
                </div>
              )}
              <div style={{ marginTop: '10px', width: '300px' }}>
                <Button
                  component={Link}
                  to="/ListCategories"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    height: 44.5,
                    width: '300px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    letterSpacing: '0px',
                  }}
                >
                  List Categories
                </Button>
              </div>
              <div style={{ marginTop: '10px', width: '300px' }}>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  style={{
                    height: 44.5,
                    width: '300px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    letterSpacing: '0px',
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );  
};

export default Main;
