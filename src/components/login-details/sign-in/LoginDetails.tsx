import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Avatar,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./LoginDetails.css";

interface LoginForm {
  // Skapar ett interface för loginformuläret
  username: string;
  password: string;
}

interface LoginDetailsProps { // Skapar ett interface för propsen som skickas in i komponenten
  // Skapar en funktion som tar emot ett argument av typen string och inte returnerar något värde (void)
  //som sedan skickas in i komponenten som en prop med namnet onLogin
  onLogin: (newToken: string) => void; 
}

const LoginDetails: React.FC<LoginDetailsProps> = ({ onLogin }) => {
  
  const {
    handleSubmit, // Används för att hantera submit av formuläret
    control, // Används för att hantera kontrollerade komponenter
    formState: { errors }, // Formstate används för att hantera validering av formuläret
    setValue, // Används för att sätta värdet på ett fält i formuläret
  } = useForm<LoginForm>(); // useForm används för att hantera formuläret

  const navigate = useNavigate(); // Används för att kunna navigera till en annan sida
  const [loginError, setLoginError] = useState<string | null>(null); // Sätter state för loginError till null
  const [rememberMe, setRememberMe] = useState(false); // Sätter state för rememberMe till false
  const [showPassword, setShowPassword] = useState(false); // Sätter state för showPassword till false

  const clearLoginError = () => { // Skapar en funktion som sätter state för loginError till null
    setLoginError(null);
  };

  const handleRememberMeChange = ( // Skapar en funktion som sätter state för rememberMe till true eller false beroende på om checkboxen är ikryssad eller inte
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername"); // Sparar värdet på rememberedUsername från localStorage i variabeln rememberedUsername
    const rememberedPassword = localStorage.getItem("rememberedPassword"); // Sparar värdet på rememberedPassword från localStorage i variabeln rememberedPassword
    if (rememberedUsername && rememberedPassword) { // Om rememberedUsername och rememberedPassword har ett värde så körs koden nedan
      setValue("username", rememberedUsername); // Sätter värdet på username till rememberedUsername
      setValue("password", rememberedPassword); // Sätter värdet på password till rememberedPassword
      setRememberMe(true); // Sätter state för rememberMe till true
    }
  }, [setValue]); // setValue är en dependency som används för att useEffect ska köras när setValue ändras

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch("https://app-productmanager-prod.azurewebsites.net/login", { // Skickar in data från formuläret till API:et
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Sätter header till application/json
        body: JSON.stringify(data), // Gör om datan till en sträng och skickar med den i body
      });

      if (!data.username || !data.password) { // Om username eller password är tomma så körs koden nedan
        setLoginError("Both username and password are required.");
        return;
      }

      if (response.status === 200) { // Om statuskoden är 200 så körs koden nedan
        const responseData = await response.json(); // Sparar datan från API:et i variabeln responseData

        if (responseData.token) { // Om det finns en token i responseData så körs koden nedan
          const jwtToken = responseData.token; // Sparar token i variabeln jwtToken
          const isAdmin = responseData.isAdmin; // Sparar isAdmin i variabeln isAdmin

          localStorage.setItem("token", jwtToken); // Sparar token i localStorage
          localStorage.setItem("username", responseData.username); // Sparar username i localStorage
          localStorage.removeItem("messageShown"); // Tar bort messageShown från localStorage
          localStorage.setItem("isAdmin", isAdmin); // Sparar isAdmin i localStorage

          onLogin(jwtToken); // Anropar funktionen onLogin och skickar med jwtToken som argument
          navigate("/Main"); // Navigerar till sidan Main

          console.log("Token:", jwtToken);
        }
      } else {
        setLoginError("Misslyckat inloggningsförsök. Försök igen");
      }

      if (rememberMe) { // Om rememberMe är true så körs koden nedan
        localStorage.setItem("rememberedUsername", data.username); // Sparar username i localStorage
        localStorage.setItem("rememberedPassword", data.password); // Sparar password i localStorage
      } else {
        localStorage.removeItem("rememberedUsername"); // Tar bort rememberedUsername från localStorage
        localStorage.removeItem("rememberedPassword"); // Tar bort rememberedPassword från localStorage
      }
    } catch (error) { // Om det blir error när datan ska skickas till API:et så loggas det ut i konsolen
      console.error("Network error:", error); // Loggar ut error i konsolen
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#d6d5d5",
          boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
          padding: "30px 0 30px 0",
          width: "30%",
          borderRadius: 5,
          margin: "30px auto",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "error.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          style={{ marginBottom: "25px" }}
          component="h1"
          variant="h5"
        >
          Logga in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "300px" }}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: "Användarnamn måste vara ifylld" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Användarnamn
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.username)}
                      onFocus={clearLoginError}
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                    />
                  </>
                )}
              />
              {errors.username && (
                <div className="error">{errors.username.message}</div>
              )}
            </div>
            <div style={{ marginTop: "10px", width: "300px" }}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Lösenord måste vara ifylld" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Lösenord
                        </span>
                      }
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.password)}
                      onFocus={clearLoginError}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" color="error" />
                              ) : (
                                <Visibility fontSize="small" color="primary" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        style: {
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        },
                      }}
                    />
                  </>
                )}
              />
              {errors.password && (
                <div className="error">{errors.password.message}</div>
              )}
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  value="remember"
                  color="primary"
                  style={{ marginLeft: "-145px", marginTop: "3px" }}
                  onChange={handleRememberMeChange}
                />
              }
              label={
                <span
                  style={{
                    fontSize: "14px",
                    marginLeft: "-5px",
                    letterSpacing: "0px",
                  }}
                >
                  Kom ihåg mig
                </span>
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                height: 44.5,
                width: "300px",
                fontWeight: "bold",
                textTransform: "none",
                letterSpacing: "0px",
                marginTop: "10px",
              }}
            >
              <span>Logga in</span>
            </Button>
          </div>
          <Link
            to={"/RegisterAccount"}
            style={{
              textAlign: "center",
              fontSize: "14px",
              letterSpacing: "0px",
              display: "block",
              marginTop: "10px",
              color: "rgb(1, 103, 255)",
            }}
          >
            Registrera ett nytt konto
          </Link>
          {loginError && (
            <div
              style={{ textAlign: "center", width: "100%", marginTop: "10px" }}
              className="error"
            >
              {loginError}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginDetails;
