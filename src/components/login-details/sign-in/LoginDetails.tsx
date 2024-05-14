import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField, Button, Avatar, Typography,
  FormControlLabel, Checkbox,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./LoginDetails.css";
import { LoginDetailsProps, LoginProps } from "./LoginDetails.types";

const LoginDetails: React.FC<LoginDetailsProps> = ({ onLogin }) => {
  
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<LoginProps>();

  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clearLoginError = () => {
    setLoginError(null);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedUsername && rememberedPassword) {
      setValue("username", rememberedUsername);
      setValue("password", rememberedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginProps) => {
    try {
      const response = await fetch("https://app-productmanager.azurewebsites.net/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!data.username || !data.password) {
        setLoginError("Both username and password are required.");
        return;
      }

      if (response.status === 200) {
        const responseData = await response.json();

        if (responseData.token) {
          const jwtToken = responseData.token;
          const isAdmin = responseData.isAdmin;

          localStorage.setItem("token", jwtToken);
          localStorage.setItem("username", responseData.username);
          localStorage.removeItem("messageShown");
          localStorage.setItem("isAdmin", isAdmin);

          onLogin(jwtToken);
          navigate("/Main");

          console.log("Token:", jwtToken);
        }
      } else {
        setLoginError("Failed login attempt. Please try again.");
      }

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", data.username);
        localStorage.setItem("rememberedPassword", data.password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }
    } catch (error) {
      console.error("Network error:", error);
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
          Log In
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
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Username
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
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Password
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
                  Remember me
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
              <span>Log In</span>
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
            Register a new account
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
      <div style={{textAlign: 'center'}}>
        <h4>
          Profiles stored in the database:
        </h4>
          <p style={{fontSize: '12px'}}>
            Username: john.doe, Password: john (Admin User)
          </p>
          <p style={{fontSize: '12px'}}>
            Username: jane.doe, Password: jane (Regular User)
          </p>
      </div>
    </>
  );  
};

export default LoginDetails;
