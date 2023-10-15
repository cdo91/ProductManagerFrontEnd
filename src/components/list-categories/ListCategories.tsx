import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';

// Define TypeScript interfaces to match the DTO classes
interface CategoryDto {
  id: number;
  name: string;
  products: ProductDto[];
}

interface ProductDto {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
}

const ListCategories = () => {

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    fetch('https://localhost:1000/categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: CategoryDto[]) => {
        const categoriesWithProducts = data.filter((category) => category.products.length > 0);
        setCategories(categoriesWithProducts);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Container
      style={{
        backgroundColor: '#d6d5d5',
        boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
        padding: '30px 0 30px 0',
        width: '50%',
        borderRadius: 5,
        margin: '30px auto',
      }}
      className="search-product-container"
    >
      <div style={{ position: 'absolute', marginTop: '-23px', display: 'flex', justifyContent: 'flex-start', marginLeft: '10px' }}>
        <IconButton size="small" component={Link} to="/Main" className="link-to-adminmain">
          <HomeIcon />
        </IconButton>
      </div>
      {categories.map((category: CategoryDto) => (
        <div key={category.id}>
          <TableContainer
            component={Paper}
            style={{
              marginTop: '20px',
              border: 'none',
              boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
              width: '90%',
              margin: '20px auto',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center', backgroundColor: '#1877c5', color: '#fff' }}>
                    <Typography variant='h6' style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {category.name} ({category.products.length})
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
                  <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>
                    Namn
                  </TableCell>
                  <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>
                    SKU
                  </TableCell>
                  <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>
                    Beskrivning
                  </TableCell>
                  <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>
                    Bild (URL)
                  </TableCell>
                  <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>
                    Pris
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category.products.map((product: ProductDto, index: number) => (
                  <TableRow key={product.id} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.description}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.imageUrl}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.price} SEK</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </Container>
  );
};

export default ListCategories;
