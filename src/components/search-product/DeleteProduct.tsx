import React, { useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const DeleteProduct = () => {
  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct;

  const navigate = useNavigate();
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(true);
  const [isProductDeletedMessageVisible, setIsProductDeletedMessageVisible] = useState(false);
  const token = localStorage.getItem('token');  
  
  const fetchAndLogProducts = async () => {
    try {
      const response = await fetch('https://localhost:1000/products', { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      });
      if (response.ok) {
        const products = await response.json();
        console.log('Products:', products);
      } else {
        console.error('Failed to fetch products.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConfirmYes = async () => {
    if (!selectedProduct) {
      // Handle the case where selectedProduct is not available
      console.error('No product selected for deletion');
      return;
    }

    const { sku } = selectedProduct;
    const deleted = await deleteProduct(sku);

    if (deleted) {
      setIsProductDeletedMessageVisible(true);
      setIsDeleteConfirmationVisible(false);

      setTimeout(() => {
        fetchAndLogProducts();
        setIsProductDeletedMessageVisible(false);
        navigate('/Main');
      }, 2000);
    } else {
      // Handle the case where the deletion failed
      console.error('Product deletion failed');
    }
  };

  const handleConfirmNo = () => {
    setIsDeleteConfirmationVisible(false); // Hide confirmation prompt
    navigate('/SearchProduct');
  };

  const deleteProduct = async (sku: string) => {
    try {
        const response = await fetch(`https://localhost:1000/products/${sku}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
            // Product was successfully deleted
            return true;
        } else {
            // Handle the case where the deletion failed
            return false;
        }
        } catch (error) {
        console.error('An error occurred while deleting the product:', error);
        return false;
        }
    };

  return (
    <>
      {isDeleteConfirmationVisible && (
        <Container
          style={{
            backgroundColor: '#d6d5d5',
            boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
            padding: '30px 0 30px 0',
            width: '50%',
            borderRadius: 5,
            margin: '30px auto',
            display: 'flex', 
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center'
          }}
          className="search-product-container"
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
                  <TableRow className='tablehead'>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProduct && ( // Check if selectedProduct is available
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
              color='primary'
              className="confirmation-prompt-button"
              onClick={handleConfirmYes}
              variant='contained'
              style={{
                marginRight: 5,
                fontWeight: 'bold',
                textTransform: 'none',
                letterSpacing: '0px',
                display: 'inline-block'
              }}
            >
              Ja
            </Button>
            <Button
              color="error"
              className="confirmation-prompt-button"
              onClick={handleConfirmNo}
              variant='contained'
              style={{
                marginLeft: 5,
                fontWeight: 'bold',
                textTransform: 'none',
                letterSpacing: '0px',
                display: 'inline-block'
              }}
            >
              Nej
            </Button>
            </div>
        </Container>
      )}
      {isProductDeletedMessageVisible && (
        <Container
          style={{
            backgroundColor: '#2979ff',
            boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
            padding: '30px 0 30px 0',
            width: '30%',
            borderRadius: 5,
            margin: '30px auto',
            fontWeight: 600,
            color: 'white',
            textAlign: 'center'
          }}
          className="search-product-container"
        >
          <div>
            <p>Produkt raderad</p>
          </div>
        </Container>
      )}
    </>
  );
};

export default DeleteProduct;
