import React, { useState } from 'react';
import {
  Table, TableBody, TableCell,TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogContent,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clear } from '@mui/icons-material';
import SearchProduct from './SearchProduct';

const DeleteProduct = () => {

  const location = useLocation(); // Hämtar location från react-router-dom som används för att skicka med data mellan komponenter 
  const selectedProduct = location.state?.selectedProduct; // Sparar selectedProduct i variabeln selectedProduct som skickas med från komponenten SearchProduct

  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(true); // Sätter typen till boolean
  const [isProductDeletedMessageVisible, setIsProductDeletedMessageVisible] = useState(false); // Sätter typen till boolean
  const token = localStorage.getItem('token'); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et
  const navigate = useNavigate(); // Hämtar navigate från react-router-dom som används för att navigera mellan komponenter

  const handleConfirmYes = async () => {
    try {
      const { sku } = selectedProduct; // Sparar sku från selectedProduct i variabeln sku
      const response = await fetch(`https://localhost:1000/products/${sku}`, { // Hämtar data från API:et
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Sätter Content-Type till application/json
          'Authorization': `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
        },
      });
  
      if (response.ok) { // Om det går att hämta data från API:et så körs koden nedan
        setIsProductDeletedMessageVisible(true); // Visar meddelande om att produkten är raderad
        setIsDeleteConfirmationVisible(false); // Döljer bekräftelseprompten
        setTimeout(() => {
          setIsProductDeletedMessageVisible(false); // Döljer meddelandet om att produkten är raderad
          navigate('/Main'); // Navigerar tillbaka till Main
        }, 2000); // Sätter en timer på 2 sekunder
      } else {
        console.error('Borttagning av produkt misslyckades');
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleConfirmNo = () => {
    setIsDeleteConfirmationVisible(false); // Döljer bekräftelseprompten
    navigate('/SearchProduct'); // Navigerar tillbaka till SearchProduct
  };

  return (
    <>
      <SearchProduct/>
      {isDeleteConfirmationVisible && (
        <Dialog open={isDeleteConfirmationVisible} 
          onClose={handleConfirmNo} 
          maxWidth="md" 
          fullWidth 
        >
          <DialogContent
            style={{
              backgroundColor: '#d6d5d5',
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
            }}
          >
            <p>Radera produkt?</p>
            <TableContainer
              component={Paper}
              style={{
                marginTop: '20px',
                border: 'none',
                boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
                width: '80%',
                margin: '20px auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow className="tablehead">
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProduct && (
                    <TableRow key={selectedProduct.id}>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.name}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.sku}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.description}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.imageUrl}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.price} SEK</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color="primary"
                className="confirmation-prompt-button"
                onClick={handleConfirmYes}
                variant="contained"
                style={{ marginRight: 5, borderRadius: '10rem' }}
              >
                <Check />
              </Button>
              <Button
                color="error"
                className="confirmation-prompt-button"
                onClick={handleConfirmNo}
                variant="contained"
                style={{ borderRadius: '10rem' }}
              >
                <Clear />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isProductDeletedMessageVisible && (
        <Dialog open={isProductDeletedMessageVisible} onClose={handleConfirmNo} maxWidth="sm" fullWidth >
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
              width: '90%',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            <p>Produkt raderad</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DeleteProduct;


