import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Grid,
} from '@mui/material';

import './LoginDetails.css';

interface LoginForm {
    username: string;
    password: string;
}

interface LoginDetailsProps {
    onLogin: (newToken: string) => void;
  }

const LoginDetails: React.FC<LoginDetailsProps> = ({ onLogin }) => {

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginForm>();

    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);

    const clearLoginError = () => {
        setLoginError(null);
    };

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await fetch('https://localhost:1000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            if (!data.username || !data.password) {
                // Show a validation error message to the user
                setLoginError('Both username and password are required.');
                return; // Prevent form submission
            }
    
            if (response.status === 200) {
                const responseData = await response.json();
    
                if (responseData.token) {
                    const jwtToken = responseData.token;
                    const isAdmin = responseData.isAdmin;
    
                    // Save the token and user role in local storage
                    localStorage.setItem('token', jwtToken);
                    localStorage.setItem('username', responseData.username);
                    localStorage.removeItem('messageShown'); // Remove the flag on successful login
                    localStorage.setItem('isAdmin', isAdmin);
                    onLogin(jwtToken);
    
                    if (responseData.isAdmin) {
                        // Redirect to the admin page
                        navigate('/Main');
                    } else {
                        // Redirect to the regular user page
                        navigate('/Main');
                    }
                } else {
                    setLoginError('Misslyckat inloggningsförsök. Försök igen');
                }
            } else {
                setLoginError('Misslyckat inloggningsförsök. Försök igen');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };
    
    return (
        <>
          <Container
            style={{
              backgroundColor: "#d6d5d5",
              boxShadow: '3px 3px 10px rgba(68, 68, 68, 0.5)',
              padding: '30px 0 30px 0',
              width: '30%',
              borderRadius: 5,
              margin: '30px auto',
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '300px' }}>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Användarnamn måste vara ifylld' }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          label={<span style={{ fontSize: '14px' }}>Användarnamn</span>}
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.username)}
                          onFocus={clearLoginError}
                          style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                          }}
                        />
                      </>
                    )}
                  />
                  {errors.username && <div className="error">{errors.username.message}</div>}
                </div>
                <div style={{ marginTop: '10px', width: '300px' }}>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Lösenord måste vara ifylld' }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          label={<span style={{ fontSize: '14px' }}>Lösenord</span>}
                          type="password"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.password)}
                          onFocus={clearLoginError}
                          style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: '2px 2px 2px rgba(126, 125, 125, 0.5)',
                          }}
                        />
                      </>
                    )}
                  />
                  {errors.password && <div className="error">{errors.password.message}</div>}
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    height: 44.5,
                    width: '300px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    letterSpacing: '0px',
                    marginTop: '10px',
                  }}
                >
                  <span>Logga in</span>
                </Button>
              </div>
              {loginError && <div className="error">{loginError}</div>}
            </form>
          </Container>
        </>
      );
    };
    
    export default LoginDetails;
