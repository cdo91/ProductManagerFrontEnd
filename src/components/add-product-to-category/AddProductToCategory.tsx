import React, { useEffect, useState } from 'react';
import './AddProductToCategory.css';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface Category {
  id: number;
  name: string;
}

type SearchFormInputs = {
  sku: string;
};

const AddProductToCategory = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchFormInputs>();

  const [searchResult, setSearchResult] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(true);
  const [isProductSavedToCategoryMessage, setIsProductSavedToCategoryMessage] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const clearError = () => {
    setError('');
    setError2('');  
  };

  const handleSearch = async (data: SearchFormInputs) => {
    const { sku } = data;
    try {
      const response = await fetch(`https://localhost:1000/products/${sku}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setError('Produkt saknas');
          setSearchResult([]);
        } else {
          setError('Ett fel uppstod vid sökningen');
        }
        return;
      }
      const result = await response.json();
      setSearchResult([result]);
      console.log('Searched Product:', result);
      setError('');
    } catch (err) {
      setError('Ej behöriget för utförande');
      console.error('Error fetching categories:', err);
      setSearchResult([]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        categories.sort((a: Category, b: Category) => a.id - b.id);
        const response = await fetch('https://localhost:1000/categories/categories-only', {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const categoriesData = await response.json();
          categoriesData.sort((a: Category, b: Category) => a.id - b.id);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const addProductToCategory = async (categoryId: number, productId: number) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };
  
      const response = await fetch(`https://localhost:1000/categories/${categoryId}/products/${productId}`, requestOptions);
  
      if (response.status === 201 || response.status === 204) {
        // Product added successfully
        setIsProductSavedToCategoryMessage(true); // Set the state to true to show the success message
        setIsSearchFormVisible(false); // Set the state to false to hide the search form
  
        setTimeout(() => {
          setIsProductSavedToCategoryMessage(false); // Set the state to false to hide the success message
          navigate("/Main");
        }, 2000); // 2 seconds
      } else if (response.status === 409) {
        // Product already exists in the category
        setError2('Produkten finns redan i den valda kategorin');
      }
    } catch (error) {
      // Handle errors
      console.error('Error adding product to category:', error);
    }
  };

  return (
    <>
      {isSearchFormVisible && (
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
          <form onSubmit={handleSubmit(handleSearch)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Controller
                name="sku"
                control={control}
                defaultValue=""
                rules={{ required: 'Sku måste vara ifylld' }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      label={<span style={{ fontSize: '14px' }}>Sök på SKU</span>}
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.sku || Boolean(error))}
                      style={{
                        width: '300px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        boxShadow: '2px 2px 4px rgba(68, 68, 68, 0.5)',
                      }}
                      onFocus={clearError}
                    />
                    {errors.sku && <div className="error">{errors.sku.message}</div>}
                    {error && <div className="error">{error}</div>}
                  </>
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  boxShadow: '2px 2px 4px rgba(68, 68, 68, 0.5)',
                  marginTop: '7px',
                  height: 40,
                  width: '300px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  letterSpacing: '0px',
                }}
              >
                Sök
              </Button>
            </div>
          </form>
          {searchResult.length > 0 && (
            <div className="search-result">
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
                        <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
                          Produkt
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
                      <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                      <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Sku</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResult.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {searchResult.length > 0 && categories.length > 0 && (
            <div className="category-list">
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
                        <Typography  style={{ fontWeight: 'bold', fontSize: 16 }}>
                          Kategorier
                        </Typography>
                      </TableCell>
                    </TableRow>
                      <TableRow style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
                        <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>Id</TableCell>
                        <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>Namn</TableCell>
                        <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', width: 100 }}>Lägg till produkt</TableCell>
                      </TableRow>
                  </TableHead>
                    <TableBody>
                    {categories.map((category, index) => (
                      <TableRow key={category.id} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                        <TableCell style={{ textAlign: 'center' }}>{category.id}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{category.name}</TableCell>
                        <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                          <IconButton
                            aria-label="Add"
                            color="primary"
                            size="small"
                            onClick={() => {
                              if (searchResult.length > 0) {
                                console.log("Kategori ID:", category.id, "Produkt ID:", searchResult[0].id);
                                addProductToCategory(category.id, searchResult[0].id);
                              }
                            }}
                            disabled={searchResult.length === 0}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {error2 && <div style={{textAlign: 'center'}} className="error">{error2}</div>}
            </div>
          )}
        </Container>
      )}
      {isProductSavedToCategoryMessage && (
        <Container
          className="product-saved-message-container"
          style={{
            backgroundColor: "#2979ff",
            boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
            padding: '30px 0 30px 0',
            width: '30%',
            borderRadius: 5,
            margin: '30px auto',
            textAlign: 'center',
            fontWeight: 600,
            color: 'white',
          }}
        >
          <div className="confirmation-message">
            Produkt tillagd till kategori
          </div>
        </Container>
      )}
    </>
  );
}

export default AddProductToCategory;
