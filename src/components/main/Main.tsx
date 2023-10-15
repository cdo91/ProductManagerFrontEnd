import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const Main = () => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [message, setMessage] = useState<string | null>(null);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [messageShown, setMessageShown] = useState(localStorage.getItem('messageShown'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    if (storedUsername && !messageShown) {
      setMessage(`Välkommen, ${storedUsername}!`);
      const timer = setTimeout(() => {
        setMessage(null);
        setUsernameLoaded(true);
        setMessageShown('true');
        localStorage.setItem('messageShown', 'true'); // Set the flag in localStorage
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setUsernameLoaded(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('messageShown');
  };

  return (
    <>
      {message && (
        <Typography
          style={{
            marginTop: 30,
            backgroundColor: '#2979ff',
            boxShadow: '3px 3px 5px rgba(68, 68, 68, 0.5)',
            padding: '1%',
            width: '30%',
            borderRadius: 5,
            margin: '30px auto',
            color: 'white',
          }}
          variant="h4"
          align="center"
          gutterBottom
        >
          {message}
        </Typography>
      )}
      {usernameLoaded && (
        <>
          <Container
            style={{
              backgroundColor: '#d6d5d5',
              boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
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
                  Ny produkt
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
                  Sök Produkt
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
                    Lägg till kategori
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
                    Lägg till produkt
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
                  Lista kategorier
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
                  Logga ut
                </Button>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default Main;
