import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './RegisterProduct.css';
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
    IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

interface Product {
    name: string;
    sku: string;
    description: string;
    imageUrl: string;
    price: string;
}

const RegisterProduct = () => {
    
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<Product>();

    const [skuError, setSkuError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isRegisterProductVisible, setIsRegisterProductVisible] = useState(true);
    const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false);
    const [isProductSavedMessageVisible, setIsProductSavedMessageVisible] = useState(false);
    const [formData, setFormData] = useState<Product | null>(null);
    const token = localStorage.getItem('token');

    const clearSkuError = () => {
        setSkuError(null);
    };

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
            }   
            else {
                console.error('Failed to fetch products.');
            }
        }   
        catch (error) {
            console.error('Error:', error);
        }
    };

    const onSubmit = async (data: Product) => {    
        setIsConfirmationPromptVisible(true);
        setIsRegisterProductVisible(false)
        setFormData(data);
    };

    const handleConfirmYes = async (data: Product) => {
        try {
            const response = await fetch('https://localhost:1000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                reset();
                fetchAndLogProducts();
                setIsConfirmationPromptVisible(false);
                setIsProductSavedMessageVisible(true) // Show confirmation prompt
                setFormData(data);
                setTimeout(() => {
                    setIsProductSavedMessageVisible(false);
                    navigate('/AdminMain'); // Redirect to AdminMain.tsx
                }, 2000); // 2 seconds
            } 
            else if (response.status === 409) {
                setIsConfirmationPromptVisible(false);
                setIsRegisterProductVisible(true);
                setSkuError('SKU finns redan');
                console.error('Failed to create product.');
            }
        } 
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleConfirmNo = () => {
        setIsConfirmationPromptVisible(false); // Hide confirmation prompt
        setIsRegisterProductVisible(true) 
        reset(); // Clear input fields
    };

    return (
        <>
            {isRegisterProductVisible && (
            <div 
                className="register-product-container"
                style={{
                    backgroundColor: "#d6d5d5",
                    boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
                    padding: '30px 0 30px 0',
                    width: '50%',
                    borderRadius: 5,
                    margin: '30px auto',
                }}
            >
                <div style={{ position: 'absolute', marginTop: '-23px', display: 'flex', justifyContent: 'flex-start', marginLeft: '10px' }}>
                    <IconButton  size="small" component={Link} to="/Main" className="link-to-adminmain">
                    <HomeIcon />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '300px' }}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Namn måste vara ifylld.' }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label={<span style={{ fontSize: '14px' }}>Namn</span>}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.name)}
                                            onFocus={clearSkuError}
                                            style={{
                                                width: '100%',
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
                        </div>
                        <div style={{ width: '300px', marginTop: '10px' }}>
                            <Controller
                                name="sku"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'SKU måste vara ifylld' }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label={<span style={{ fontSize: '14px' }}>SKU</span>}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.sku || Boolean(skuError))}
                                            onFocus={clearSkuError}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'white',
                                                borderRadius: '5px',
                                                boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                                            }}
                                        />
                                        {errors.sku && (
                                            <div className="error">{errors.sku.message}</div>
                                        )}
                                        {skuError && (
                                            <div className="error">{skuError}</div>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div style={{ width: '300px', marginTop: '10px' }}>
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
                                            onFocus={clearSkuError}
                                            style={{
                                                width: '100%',
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
                        </div>
                        <div style={{ width: '300px', marginTop: '10px' }}>
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
                                            onFocus={clearSkuError}
                                            style={{
                                                width: '100%',
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
                        </div>
                        <div style={{ width: '300px', marginTop: '10px' }}>
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
                                            onFocus={clearSkuError}
                                            style={{
                                                width: '100%',
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
                        </div>                
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
                            Registrera Produkt
                        </Button>
                    </div>
                </form>
            </div>
        )}

{isConfirmationPromptVisible && (
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        }}
    >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="confirmation-prompt">
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
                    onClick={() => {
                        if (formData) {
                            handleConfirmYes(formData);
                        }
                    }}
                    variant='contained'
                    style={{
                        display: 'inline-block',
                        marginRight: 5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        letterSpacing: '0px',
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
                        display: 'inline-block',
                        marginLeft: 5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        letterSpacing: '0px',
                    }}
                >
                    Nej
                </Button>
            </div>
        </div>
    </Container>
)}


            {isProductSavedMessageVisible && (
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
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    <div className="confirmation-message">
                        Produkt sparad
                    </div>
                </Container>
            )}
        </>
    );
};

export default RegisterProduct;
