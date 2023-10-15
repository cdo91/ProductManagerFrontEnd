import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';


interface Product {
    name: string;
    sku: string;
    description: string;
    imageUrl: string;
    price: string;
}

const UpdateProduct = () => {

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<Product>();
    
    const navigate = useNavigate();
    const [isUpdateInputVisible, setIsUpdateInputVisible] = useState(true);
    const [isUpdateConfirmationVisible, setIsUpdateConfirmationVisible] = useState(false);
    const [isProductUpdatedMessageVisible, setIsProductUpdatedMessageVisible] = useState(false);
    const [formData, setFormData] = useState<Product | null>(null);
    const token = localStorage.getItem('token');

    const location = useLocation();
    const initialSku = location.state?.sku || '';

    const fetchAndLogProducts = async (data: Product) => {
        try {
            const response = await fetch(`https://localhost:1000/products/${data.sku}`, { 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              });
          if (response.ok) {
            const products = await response.json();
            console.log('Product:', products);
          } else {
            console.error('Failed to fetch products.');
          }
        } catch (error) {
          console.error('Error:', error);
        }  
    };

    const handleConfirmNo = () => {
        reset();
        setIsUpdateInputVisible(true); // Hide confirmation prompt
        setIsUpdateConfirmationVisible(false);
    };
    
    const handleConfirmYes = async (data: Product) => {
        try {
            const response = await fetch(`https://localhost:1000/products/${data.sku}`, {
                method: 'PUT', // Use PUT method to update the existing resource
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                fetchAndLogProducts(data);
                setIsUpdateConfirmationVisible(false);
                setIsProductUpdatedMessageVisible(true);
                setFormData(data);

                setTimeout(() => {
                    setIsProductUpdatedMessageVisible(false);
                    navigate('/Main'); // Redirect to AdminMain.tsx
                }, 2000); // 2 seconds
            } else {
                console.error('Failed to update product.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const onSubmit = async (data: Product) => {
        setIsUpdateInputVisible(false); // Show confirmation prompt
        setIsUpdateConfirmationVisible(true);
        setFormData(data);
    };
    
  return (
    <>
        {isUpdateInputVisible && (
            <Container 
                className="register-product-container"
                style={{
                    backgroundColor: "#d6d5d5",
                    boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
                    padding: '30px 0 30px 0',
                    width: '30%',
                    borderRadius: 5,
                    margin: '30px auto',
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center'
                }}
            >
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'flex-start', marginLeft: '20px', marginTop: '-15px' }}>
                <Link to="/AdminMain" className="link-to-adminmain">
                    <HomeIcon />
                </Link>
            </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=''
                                rules={{ required: 'Namn måste vara ifylld.' }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                        {...field}
                                        label={<span style={{ fontSize: '14px' }}>Namn</span>}
                                        variant="outlined"
                                        fullWidth
                                        error={Boolean(errors.name)}
                                        style={{
                                            width: '300px',
                                            backgroundColor: 'white',
                                            borderRadius: '5px',
                                            boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                                        }}
                                        />
                                        {errors.name && (
                                            <div className="error">{errors.name.message}</div>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="sku"
                                control={control}
                                defaultValue={initialSku}
                                rules={{ required: 'SKU måste vara ifylld' }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label={<span style={{ fontSize: '14px' }}>SKU</span>}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.sku)}
                                            disabled
                                            style={{
                                                width: '300px',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                                            }}
                                        />
                                        {errors.sku && (
                                            <div className="error">{errors.sku.message}</div>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Beskrivning måste vara ifylld' }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            variant='outlined'
                                            multiline
                                            fullWidth
                                            minRows={3}
                                            error={Boolean(errors.description)}
                                            label={<span style={{ fontSize: '14px' }}>Beskrivning</span>}

                                            style={{
                                                width: '300px',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                                                border: 'none',
                                            }}
                                        />
                                        {errors.description && (
                                            <div className="error">{errors.description.message}</div>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="imageUrl"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Bild (URL) måste vara ifylld',
                                    pattern: {
                                    value: /^https?:\/\/.+$/,
                                    message: 'Felaktig URL format.',
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label={<span style={{ fontSize: '14px' }}>Bild (URL)</span>}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.imageUrl)}
                                            style={{
                                                width: '300px',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                                            }}
                                        />
                                        {errors.imageUrl && (
                                            <div className="error">{errors.imageUrl.message}</div>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="price"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Pris måste vara ifylld',
                                    pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Pris måste vara ett heltal',
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label={<span style={{ fontSize: '14px' }}>Pris</span>}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.price)}
                                            style={{
                                                width: '300px',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)'
                                            }}
                                        />
                                        {errors.price && (
                                            <div className="error">{errors.price.message}</div>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{
                            marginTop: 10,
                            height: 44.5,
                            width: '300px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            letterSpacing: '0px',
                        }}
                    >
                        Uppdatera
                    </Button>
                </form>
            </Container>
        )}

        {isUpdateConfirmationVisible && (
            
                <Container
             className="confirmation-prompt-container"
             style={{
                 backgroundColor: "#d6d5d5",
                 boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
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
         >
             
                 <p>Är detta korrekt?</p>
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
                         <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
                         <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>SKU</TableCell>
                         <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
                         <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Bild (URL)</TableCell>
                         <TableCell style={{ color: '#fff',fontWeight: 'bold', textAlign: 'center' }}>Price</TableCell>
                     </TableRow>
                     </TableHead>
                     <TableBody>
                         {formData && (
                             <TableRow className="alternate-row">
                             <TableCell style={{ textAlign: 'center' }}>{formData.name}</TableCell>
                             <TableCell style={{ textAlign: 'center' }}>{formData.sku}</TableCell>
                             <TableCell style={{ textAlign: 'center' }}>{formData.description}</TableCell>
                             <TableCell style={{ textAlign: 'center' }}>{formData.imageUrl}</TableCell>
                             <TableCell style={{ textAlign: 'center' }}>{formData.price}</TableCell>
                             </TableRow>
                         )}
                     </TableBody>
                 </Table>
                 </TableContainer>
                 <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        color='primary' 
                        className="confirmation-prompt-button" 
                        variant='contained'
                        onClick={() => {
                            if (formData) {
                                handleConfirmYes(formData);
                            }
                        }}
                        style={{

                            marginRight: 5, // Add margin to the right
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
                            marginLeft: 5, // Add margin to the left
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

        {isProductUpdatedMessageVisible && (
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
            <p>Produkt uppdaterad</p>
          </div>
        </Container>
      )}

    </>
  )
}

export default UpdateProduct
