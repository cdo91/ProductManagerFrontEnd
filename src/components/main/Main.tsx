import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import jwt_decode from 'jwt-decode';
import { Dialog, DialogContent } from '@mui/material';

interface DecodedToken { // Skapar en interface för att kunna dekoda token
  given_name: string;
  family_name: string;
}

const Main = () => {

  const [firstName, setFirstName] = useState<string | null>(null); // Sätter typen till string eller null
  const [lastName, setLastName] = useState<string | null>(null); // Sätter typen till string eller null
  const [message, setMessage] = useState<string | null>(null); // Sätter typen till string eller null
  const [usernameLoaded, setUsernameLoaded] = useState(false); // Sätter typen till boolean
  const [messageShown, setMessageShown] = useState(localStorage.getItem('messageShown')); // Sätter typen till string eller null
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Sätter typen till boolean och kollar om användaren är admin eller inte genom att hämta isAdmin från localStorage
  const token = localStorage.getItem('token'); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et

  useEffect(() => {
    if (token) { // Om token finns så dekodas den och sätts i variablerna firstName och lastName
      const decodedToken = jwt_decode<DecodedToken>(token); // Dekodar token och sätter typen till DecodedToken som är en interface
      setFirstName(decodedToken.given_name); // Sparar förnamnet i variabeln firstName 
      setLastName(decodedToken.family_name); // Sparar efternamnet i variabeln lastName
    }

    if (firstName && lastName && !messageShown) { // Om firstName och lastName finns och messageShown inte finns så körs koden nedan
      setMessage(`Välkommen, ${firstName} ${lastName}!`); // Sparar ett meddelande i variabeln message
      const timer = setTimeout(() => {
        setMessage(null); // Sätter message till null
        setUsernameLoaded(true);
        setMessageShown('true'); // Sparar messageShown i localStorage så att meddelandet inte visas igen
        localStorage.setItem('messageShown', 'true'); // Sparar messageShown i localStorage så att meddelandet inte visas igen
      }, 2000); // Sätter en timer på 2 sekunder
      return () => clearTimeout(timer); // Returnerar en funktion som rensar timern när komponenten unmountas så att det inte blir något memory leak 
    } else if (firstName && lastName && messageShown) {
      setUsernameLoaded(true); // Sätter usernameLoaded till true
    }
  }, [token, firstName, lastName, messageShown]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Tar bort token från localStorage
    localStorage.removeItem('isAdmin'); // Tar bort isAdmin från localStorage
    localStorage.removeItem('messageShown'); // Tar bort messageShown från localStorage
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
          </div>
        </>
      )}
    </>
  );
};

export default Main;
