import React, { useEffect, useState } from 'react';
import './SearchProduct.css';
import { useForm, Controller } from 'react-hook-form';
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { Link, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
  category: Category;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

type SearchFormInputs = {
  name: string;
  sku: string;
};

const SearchProduct = () => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SearchFormInputs>();

  const [searchResultByName, setSearchResultByName] = useState<Product[]>([]);
  const [searchResultBySku, setSearchResultBySku] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchedProductByCategory, setSearchedProductCountByCategory] = useState<{ [categoryId: number]: number }>({});
  const [error, setError] = useState('');
  const [searchOption, setSearchOption] = useState<'name' | 'sku'>('name');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const clearError = () => {
    setError('');
  };

  const clearSearchResults = () => {
    setSearchResultByName([]);
    setSearchResultBySku([]);
    setError('');
    reset({ name: '', sku: '' });
  };
  

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await fetch('https://localhost:1000/categories', {
          headers: {
              
              'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const handleSearch = async (data: SearchFormInputs) => {
    const { name, sku } = data;
    try {
      if (searchOption === 'name') {
        const response = await fetch(`https://localhost:1000/products?name=${name}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            setError('Produkt saknas');
          } else {
            setError('Ett fel uppstod vid sökningen');
          }
          setSearchResultByName([]);
        } else {
          const result = await response.json();
          const productsWithCategories = result.map((product: Product) => {
            const category = categories.find((c) =>
              c.products.some((p) => p.id === product.id)
            );
            return { ...product, category };
          });

          const countByCategory: { [categoryId: number]: number } = {};
          categories.forEach((category) => {
            const count = productsWithCategories.filter(
              (product: {
                name: string; category: { id: number } }) =>
                product.category?.id === category.id &&
                product.name.toLowerCase() === name.toLowerCase()
            ).length;
            countByCategory[category.id] = count;
          });

          setSearchedProductCountByCategory(countByCategory);
          setSearchResultByName(productsWithCategories);
          setError('');
        }
      } else if (searchOption === 'sku') {
        const response = await fetch(`https://localhost:1000/products/${sku}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            setError('Produkt saknas');
          } else {
            setError('Ett fel uppstod vid sökningen');
          }
          setSearchResultBySku([]);
        } else {
          const result = await response.json();
          setSearchResultBySku([result]);
          setError('');
        }
      }
    } catch (err) {
      setError('Ett fel uppstod vid sökningen');
      setSearchResultByName([]);
      setSearchResultBySku([]);
    }
  };

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
      <form onSubmit={handleSubmit(handleSearch)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ToggleButtonGroup
            exclusive
            value={searchOption}
            onChange={(_, newValue) => { 
              setSearchOption(newValue as 'name' | 'sku');
              clearSearchResults();
            }}
            style={{ marginLeft: 200, marginBottom: '5px', boxShadow: '2px 2px 2px rgba(68, 68, 68, 0.5)' }}
          >
            <ToggleButton
              value="name"
              style={{
                fontSize: '11px',
                height: '24px',
                backgroundColor: searchOption === 'name' ? '#004c9c' : 'white', // Blue when selected, white otherwise
                color: searchOption === 'name' ? 'white' : 'black', // White text when selected, black otherwise
                letterSpacing: '0px',
                textTransform: 'none',
                width: '50px'

              }}
            >
              Namn
            </ToggleButton>
            <ToggleButton
              value="sku"
              style={{
                fontSize: '11px',
                height: '24px',
                backgroundColor: searchOption === 'sku' ? '#004c9c' : 'white', // Blue when selected, white otherwise
                color: searchOption === 'sku' ? 'white' : 'black', // White text when selected, black otherwise
                letterSpacing: '0px',
                textTransform: 'none',
                width: '50px'
              }}
            >
              Sku
            </ToggleButton>
          </ToggleButtonGroup>
          <Controller
            name={searchOption === 'name' ? 'name' : 'sku'}
            control={control}
            defaultValue=""
            rules={{ required: searchOption === 'name' ? 'Namn måste vara ifyllt' : 'SKU måste vara ifyllt' }}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  type="text"
                  label={<span style={{ fontSize: '14px' }}>Sök på {searchOption === 'name' ? 'Namn' : 'Sku'}</span>}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors[searchOption] || Boolean(error))}
                  style={{
                    width: '300px',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    boxShadow: '2px 2px 4px rgba(68, 68, 68, 0.5)',
                  }}
                  onFocus={clearError}
                />
                {errors[searchOption] && <div className="error">{errors[searchOption]?.message}</div>}
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

      {searchOption === 'name' && searchResultByName.length > 0 && (
        <div className="search-result">
          {searchResultByName
            .filter((product) => categories.some((category) => product.category?.id === category.id && searchedProductByCategory[category.id] > 0))
            .map((product) => (
                <TableContainer
                  component={Paper}
                  key={product.id}
                  style={{
                    border: 'none',
                    boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
                    width: '90%',
                    margin: '20px auto',
                  }}
                >
                  {categories
                    .filter((category) => product.category?.id === category.id && searchedProductByCategory[category.id] > 0)
                    .map((category) => (
                      <Table key={category.id}>
                        <TableHead>
                          <TableRow>
                            <TableCell colSpan={6} style={{ textAlign: 'center', backgroundColor: '#1877c5', color: '#fff' }}>
                              <Typography variant='h6' style={{ fontWeight: 'bold', fontSize: 16 }}>
                                {category.name} ({searchedProductByCategory[category.id] || 0})
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
                            <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
                            {isAdmin && (
                      <TableCell></TableCell>
                    )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={product.id}>
                            <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{product.description}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{product.imageUrl}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{product.price} SEK</TableCell>
                            {isAdmin && ( 
                      <TableCell>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          size="small"
                          onClick={() => navigate('/DeleteProduct', { state: { selectedProduct: product } })}
                        >
                          <DeleteIcon className='deleteIcon' />
                        </IconButton>
                        <IconButton onClick={() => navigate('/UpdateProduct', { state: { sku: product.sku } })} aria-label="Update" color="primary" size="small">
                          <UpdateIcon className='updateIcon' />
                        </IconButton>
                      </TableCell>
                    )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    ))}
                </TableContainer>
            ))}
        </div>
      )}

      {searchOption === 'sku' && searchResultBySku.length > 0 && (
        <div className="search-result">
          {searchResultBySku.map((product) => (
            <TableContainer
              component={Paper}
              key={product.id}
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
                  <TableRow className='tablehead'>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
                    {isAdmin && (
                      <TableCell></TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={product.id}>
                    <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.imageUrl}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.description}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{product.price} SEK</TableCell>
                    {isAdmin && ( 
                      <TableCell>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          size="small"
                          onClick={() => navigate('/DeleteProduct', { state: { selectedProduct: product } })}
                        >
                          <DeleteIcon className='deleteIcon' />
                        </IconButton>
                        <IconButton onClick={() => navigate('/UpdateProduct', { state: { sku: product.sku } })} aria-label="Update" color="primary" size="small">
                          <UpdateIcon className='updateIcon' />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </div>
      )}
    </Container>
  );
}

export default SearchProduct;


// import React, { useEffect, useState } from 'react';
// import './SearchProduct.css';
// import { useForm, Controller } from 'react-hook-form';
// import {
//   Button,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Container,
//   IconButton,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
// } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
// import DeleteIcon from '@mui/icons-material/Delete';
// import UpdateIcon from '@mui/icons-material/Update';
// import { Link, useNavigate } from 'react-router-dom';

// interface Product {
//   id: number;
//   name: string;
//   sku: string;
//   description: string;
//   imageUrl: string;
//   price: number;
//   categories: Category;
// }

// interface Category {
//   some(arg0: (prodCategory: { id: number; }) => boolean): unknown;
//   id: number;
//   name: string;
//   products: Product[];
// }

// type SearchFormInputs = {
//   name: string;
//   sku: string;
// };

// const SearchProduct = () => {
//   const {
//     handleSubmit,
//     reset,
//     control,
//     formState: { errors },
//   } = useForm<SearchFormInputs>();

//   const [searchResultByName, setSearchResultByName] = useState<Product[]>([]);
//   const [searchResultBySku, setSearchResultBySku] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [searchedProductByCategory, setSearchedProductCountByCategory] = useState<{ [categoryId: number]: number }>({});
//   const [error, setError] = useState('');
//   const [searchOption, setSearchOption] = useState<'name' | 'sku'>('name');
//   const navigate = useNavigate();

//   const clearError = () => {
//     setError('');
//   };

//   const clearSearchResults = () => {
//     setSearchResultByName([]);
//     setSearchResultBySku([]);
//     setError('');
//     reset({ name: '', sku: '' });
//   };
  

//   useEffect(() => {
//     const fetchCategoriesAndProducts = async () => {
//       try {
//         const response = await fetch('https://localhost:1000/categories');
//         if (!response.ok) {
//           throw new Error('Failed to fetch categories');
//         }
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCategoriesAndProducts();
//   }, []);

//   const handleSearch = async (data: SearchFormInputs) => {
//     const { name, sku } = data;
//     try {
//       if (searchOption === 'name') {
//         const response = await fetch(`https://localhost:1000/products/search?name=${name}`);
//         if (!response.ok) {
//           if (response.status === 404) {
//             setError('Produkt saknas');
//           } else {
//             setError('Ett fel uppstod vid sökningen');
//           }
//           setSearchResultByName([]);
//         } else {
//           const result = await response.json();
//           const productsWithCategories = result.map((product: Product) => {
//             const category = categories.find((c) =>
//               c.products.some((p) => p.id === product.id)
//             );
//             return { ...product, category };
//           });

//           const countByCategory: { [categoryId: number]: number } = {};
//           categories.forEach((category) => {
//             const count = productsWithCategories.filter(
//               (product: {
//                 name: string; category: { id: number } }) =>
//                 product.category?.id === category.id &&
//                 product.name.toLowerCase() === name.toLowerCase()
//             ).length;
//             countByCategory[category.id] = count;
//           });

//           setSearchedProductCountByCategory(countByCategory);
//           setSearchResultByName(productsWithCategories);
//           setError('');
//         }
//       } else if (searchOption === 'sku') {
//         const response = await fetch(`https://localhost:1000/products/${sku}`);
//         if (!response.ok) {
//           if (response.status === 404) {
//             setError('Produkt saknas');
//           } else {
//             setError('Ett fel uppstod vid sökningen');
//           }
//           setSearchResultBySku([]);
//         } else {
//           const result = await response.json();
//           setSearchResultBySku([result]);
//           setError('');
//         }
//       }
//     } catch (err) {
//       setError('Ett fel uppstod vid sökningen');
//       setSearchResultByName([]);
//       setSearchResultBySku([]);
//     }
//   };

//   return (
//     <Container
//       style={{
//         backgroundColor: '#d6d5d5',
//         boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
//         padding: '30px 0 30px 0',
//         width: '50%',
//         borderRadius: 5,
//         margin: '30px auto',
//       }}
//       className="search-product-container"
//     >
//       <div style={{ position: 'absolute', marginTop: '-23px', display: 'flex', justifyContent: 'flex-start', marginLeft: '10px' }}>
//         <IconButton size="small" component={Link} to="/AdminMain" className="link-to-adminmain">
//           <HomeIcon />
//         </IconButton>
//       </div>
//       <form onSubmit={handleSubmit(handleSearch)}>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <ToggleButtonGroup
//             exclusive
//             value={searchOption}
//             onChange={(_, newValue) => { 
//               setSearchOption(newValue as 'name' | 'sku');
//               clearSearchResults();
//             }}
//             style={{ marginLeft: 200, marginBottom: '5px', boxShadow: '2px 2px 2px rgba(68, 68, 68, 0.5)' }}
//           >
//             <ToggleButton
//               value="name"
//               style={{
//                 fontSize: '11px',
//                 height: '24px',
//                 backgroundColor: searchOption === 'name' ? '#004c9c' : 'white', // Blue when selected, white otherwise
//                 color: searchOption === 'name' ? 'white' : 'black', // White text when selected, black otherwise
//                 letterSpacing: '0px',
//                 textTransform: 'none',
//                 width: '50px'

//               }}
//             >
//               Namn
//             </ToggleButton>
//             <ToggleButton
//               value="sku"
//               style={{
//                 fontSize: '11px',
//                 height: '24px',
//                 backgroundColor: searchOption === 'sku' ? '#004c9c' : 'white', // Blue when selected, white otherwise
//                 color: searchOption === 'sku' ? 'white' : 'black', // White text when selected, black otherwise
//                 letterSpacing: '0px',
//                 textTransform: 'none',
//                 width: '50px'
//               }}
//             >
//               Sku
//             </ToggleButton>
//           </ToggleButtonGroup>
//           <Controller
//             name={searchOption === 'name' ? 'name' : 'sku'}
//             control={control}
//             defaultValue=""
//             rules={{ required: searchOption === 'name' ? 'Namn måste vara ifyllt' : 'SKU måste vara ifyllt' }}
//             render={({ field }) => (
//               <>
//                 <TextField
//                   {...field}
//                   type="text"
//                   label={<span style={{ fontSize: '14px' }}>Sök på {searchOption === 'name' ? 'Namn' : 'Sku'}</span>}
//                   variant="outlined"
//                   fullWidth
//                   error={Boolean(errors[searchOption] || Boolean(error))}
//                   style={{
//                     width: '300px',
//                     backgroundColor: 'white',
//                     borderRadius: '5px',
//                     boxShadow: '2px 2px 4px rgba(68, 68, 68, 0.5)',
//                   }}
//                   onFocus={clearError}
//                 />
//                 {errors[searchOption] && <div className="error">{errors[searchOption]?.message}</div>}
//                 {error && <div className="error">{error}</div>}
//               </>
//             )}
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             style={{
//               boxShadow: '2px 2px 4px rgba(68, 68, 68, 0.5)',
//               marginTop: '7px',
//               height: 40,
//               width: '300px',
//               fontWeight: 'bold',
//               textTransform: 'none',
//               letterSpacing: '0px',
//             }}
//           >
//             Sök
//           </Button>
//         </div>
//       </form>

//       {searchOption === 'name' && searchResultByName.length > 0 && (
//   <div className="search-result">
//     {categories
//       .filter((category) => {searchResultByName.some((product) => product.categories.some((prodCategory) => prodCategory.id === category.id))})
//       .map((category) => { const productCount = searchResultByName.filter((product) => product.categories.some((prodCategory) => prodCategory.id === category.id)).length;

//         return (
//           <TableContainer
//             component={Paper}
//             key={category.id}
//             style={{
//               border: 'none',
//               boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
//               width: '90%',
//               margin: '20px auto',
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell colSpan={5} style={{ textAlign: 'center', backgroundColor: '#1877c5', color: '#fff' }}>
//                     <Typography variant='h6' style={{ fontWeight: 'bold', fontSize: 16 }}>
//                       {category.name} ({productCount || 0})
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
//                   <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
//                   <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
//                   <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
//                   <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
//                   <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {searchResultByName
//                   .filter((product) =>
//                     product.categories.some((prodCategory) => prodCategory.id === category.id)
//                   )
//                   .map((product) => (
//                     <TableRow key={product.id}>
//                       <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
//                       <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
//                       <TableCell style={{ textAlign: 'center' }}>{product.description}</TableCell>
//                       <TableCell style={{ textAlign: 'center' }}>{product.imageUrl}</TableCell>
//                       <TableCell style={{ textAlign: 'center' }}>{product.price} SEK</TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         );
//       })}
//   </div>
// )}




//       {searchOption === 'sku' && searchResultBySku.length > 0 && (
//         <div className="search-result">
//           {searchResultBySku.map((product) => (
//             <TableContainer
//               component={Paper}
//               key={product.id}
//               style={{
//                 marginTop: '20px',
//                 border: 'none',
//                 boxShadow: '3px 3px 4px rgba(68, 68, 68, 0.5)',
//                 width: '90%',
//                 margin: '20px auto',
//               }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow className='tablehead'>
//                     <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
//                     <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
//                     <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Beskrivning</TableCell>
//                     <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
//                     <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Pris</TableCell>
//                     <TableCell></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow key={product.id}>
//                     <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
//                     <TableCell style={{ textAlign: 'center' }}>{product.sku}</TableCell>
//                     <TableCell style={{ textAlign: 'center' }}>{product.imageUrl}</TableCell>
//                     <TableCell style={{ textAlign: 'center' }}>{product.description}</TableCell>
//                     <TableCell style={{ textAlign: 'center' }}>{product.price} SEK</TableCell>
//                     <TableCell>
//                       <IconButton
//                         aria-label="Delete"
//                         color="error"
//                         size="small"
//                         onClick={() => navigate('/DeleteProduct', { state: { selectedProduct: product } })}
//                       >
//                         <DeleteIcon className='deleteIcon' />
//                       </IconButton>

//                       <IconButton onClick={() => navigate('/UpdateProduct', { state: { sku: product.sku } })} aria-label="Update" color="primary" size="small">
//                         <UpdateIcon className='updateIcon' />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ))}
//         </div>
//       )}
//     </Container>
//   );
// }

// export default SearchProduct;