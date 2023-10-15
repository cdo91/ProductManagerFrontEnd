import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './AddCategory.css'
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

interface Category {
    name: string;
}

const AddCategory = () => {

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Category>();

  const navigate = useNavigate();
  const [isRegisterCategoryVisible, setIsRegisterCategoryVisible] = useState(true);
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false);
  const [isCategorySavedMessageVisible, setIsCategorySavedMessageVisible] = useState(false);
  const [formData, setFormData] = useState<Category | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const clearError = () => {
    setErrorName(null);
  };

  const fetchAndLogCategories = async () => {
    try {
        const response = await fetch('https://localhost:1000/categories', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
          });
        if (response.ok) {
            const categories = await response.json();
            console.log('Categories:', categories);
        }   
        else {
            console.error('Failed to fetch categories.');
        }
    }   
    catch (error) {
        console.error('Error:', error);
    }
  };

  const onSubmit = async (data: Category) => {
    setIsRegisterCategoryVisible(false);
    setIsConfirmationPromptVisible(true);
    setFormData(data);
  };

  const handleConfirmYes = async (data: Category) => {
    try {
        const response = await fetch('https://localhost:1000/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            reset();
            fetchAndLogCategories();
            setIsConfirmationPromptVisible(false);
            setIsCategorySavedMessageVisible(true) // Show confirmation prompt
            setFormData(data);
            setTimeout(() => {
                setIsCategorySavedMessageVisible(false);
                navigate('/Main'); // Redirect to AdminMain.tsx
            }, 2000); // 2 seconds
        } 
        else if (response.status === 409) {
            setIsConfirmationPromptVisible(false);
            setIsRegisterCategoryVisible(true);
            setErrorName('Namn finns redan');
            console.error('Failed to create product.');
        }
    } 
    catch (error) {
        console.error('Error:', error);
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false); // Hide confirmation prompt
    setIsRegisterCategoryVisible(true) 
    reset(); // Clear input fields
  };

  return (
    <>
      {isRegisterCategoryVisible && (
        <Container 
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
        <IconButton size="small" component={Link} to="/Main" className="link-to-adminmain">
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
                                    error={Boolean(errors.name) || Boolean(errorName)}
                                    onFocus={clearError}
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
                                {errorName && (
                                    <div className="error">{errorName}</div>
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
                    Registrera Kategori
                </Button>
            </div>

        </form>
    </Container>
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
                    <TableCell style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Namn</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {formData && (
                        <TableRow className="alternate-row">
                        <TableCell style={{ textAlign: 'center' }}>{formData.name}</TableCell>
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
        </div>
    </Container>
      )}
      {isCategorySavedMessageVisible && (
        <Container
        className="category-saved-message-container"
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
            Kategori sparad
        </div>
    </Container>
      )}
    </>
  )
}

export default AddCategory
