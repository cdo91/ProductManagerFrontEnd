import React, { useState } from 'react';
import {
  Table, TableBody, TableCell,TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogContent,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clear } from '@mui/icons-material';
import SearchProduct from './SearchProduct';

const DeleteProduct = () => {

  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct;

  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(true);
  const [isProductDeletedMessageVisible, setIsProductDeletedMessageVisible] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleConfirmYes = async () => {
    try {
      const { sku } = selectedProduct;
      const response = await fetch(`https://app-productmanager.azurewebsites.net/products/${sku}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setIsProductDeletedMessageVisible(true);
        setIsDeleteConfirmationVisible(false);
        setTimeout(() => {
          setIsProductDeletedMessageVisible(false);
          navigate('/Main');
        }, 2000);
      } else {
        console.error('Product deletion failed');
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const handleConfirmNo = () => {
    setIsDeleteConfirmationVisible(false);
    navigate('/SearchProduct');
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
            <p>Delete product?</p>
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
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Image (URL)</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProduct && (
                    <TableRow key={selectedProduct.id}>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.name}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.sku}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.description}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.imageUrl}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{selectedProduct.price} $</TableCell>
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
            <p>Product deleted</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DeleteProduct;