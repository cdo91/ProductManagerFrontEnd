import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField, Button, Avatar, Typography,
  InputAdornment, Dialog, DialogContent,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { RegistrationProps } from "./RegisterAccount.types";

const RegisterAccount = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationProps>();

  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationErrorUserName, setRegistrationErrorUserName] = useState<string | null>(null);
  const [registrationErrorEmail, setRegistrationErrorEmail] = useState<string | null>(null);
  const [isRegisterAccountVisible, setIsRegisterAccountVisible] = useState(true);
  const [isAccountSavedMessageVisible, setIsAccountSavedMessageVisible] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const navigate = useNavigate();

  const clearRegistrationErrorUserName = () => {
    setRegistrationErrorUserName(null);
  };

  const clearRegistrationErrorEmail = () => {
    setRegistrationErrorEmail(null);
  };

  const onSubmit = async (data: RegistrationProps) => {
    try {
      data.admin = false;
      data.phoneNumber = "+46" + data.phoneNumber;

      if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const utcBirthDate = new Date(
          Date.UTC(
            birthDate.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate(),
            birthDate.getHours(),
            birthDate.getMinutes(),
            birthDate.getSeconds()
          )
        );
        data.birthDate = utcBirthDate;
      } else {
        data.birthDate = null;
      }

      const response = await fetch("https://app-productmanager.azurewebsites.net/login/register-account", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsRegisterAccountVisible(false);
        setIsAccountSavedMessageVisible(true);
        setTimeout(() => {
          setIsAccountSavedMessageVisible(false);
          navigate("/");
        }, 2000);
      } else if (response.status === 400) {
        const responseData = await response.json();
        if (responseData.errorType === "both") {
          setRegistrationErrorUserName("Username already exists");
          setRegistrationErrorEmail("Email already exists");
        } else if (responseData.errorType === "userName") {
          setRegistrationErrorUserName("Username already exists");
        } else if (responseData.errorType === "email") {
          setRegistrationErrorEmail("Email already exists");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setRegistrationError("Failed registration attempt. Please try again");
    }
  };

  return (
    <>
      {isRegisterAccountVisible && (
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
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography
            style={{ marginBottom: "25px" }}
            component="h1"
            variant="h5"
          >
            Join Us
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
                  name="userName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
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
                      error={
                        Boolean(errors.userName) ||
                        Boolean(registrationErrorUserName)
                      }
                      onFocus={clearRegistrationErrorUserName}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                    />
                  )}
                />
                {errors.userName && (
                  <div className="error">{errors.userName.message}</div>
                )}
                {registrationErrorUserName && (
                  <div className="error">{registrationErrorUserName}</div>
                )}
              </div>
              <div
                style={{ display: "flex", width: "300px", marginTop: "10px" }}
              >
                <div style={{ flex: 1 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            First Name
                          </span>
                        }
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.firstName)}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px",
                      }}
                    >
                      {errors.firstName.message}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, marginLeft: "5px" }}>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Last Name
                          </span>
                        }
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.lastName)}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px",
                      }}
                    >
                      {errors.lastName.message}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: "10px", width: "300px" }}>
                <Controller
                  name="birthDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Birth date is required" }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label={
                          <span
                            style={{
                              fontSize: "14px",
                              letterSpacing: "0px",
                              color: errors.birthDate ? "red" : "",
                            }}
                          >
                            Birth Date
                          </span>
                        }
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                          width: "300px",
                          border: errors.birthDate ? "1px solid red" : "none",
                          color: errors.birthDate ? "red" : "inherit",
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.birthDate && (
                  <div className="error">{errors.birthDate.message}</div>
                )}
              </div>
              <div style={{ marginTop: "10px", width: "300px" }}>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Address
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.address)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                    />
                  )}
                />
                {errors.address && (
                  <div className="error">{errors.address.message}</div>
                )}
              </div>
              <div
                style={{ display: "flex", marginTop: "10px", width: "300px" }}
              >
                <div style={{ flex: 1 }}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            City
                          </span>
                        }
                        variant="outlined"
                        error={Boolean(errors.city)}
                        fullWidth
                        style={{
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                    )}
                  />
                  {errors.city && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px",
                      }}
                    >
                      {errors.city.message}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, marginLeft: "5px" }}>
                  <Controller
                    name="zipCode"
                    control={control}
                    defaultValue={undefined}
                    rules={{
                      required: "Zip code is required",
                      pattern: {
                        value: /^\d{5}$/,
                        message: "Zip code must consist of 5 digits",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Zip Code
                          </span>
                        }
                        variant="outlined"
                        error={Boolean(errors.zipCode)}
                        fullWidth
                        value={field.value === undefined ? "" : field.value}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                    )}
                  />
                  {errors.zipCode && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px",
                      }}
                    >
                      {errors.zipCode.message}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: "10px", width: "300px" }}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email Address is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address format",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Email
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      error={
                        Boolean(errors.email) || Boolean(registrationErrorEmail)
                      }
                      onFocus={clearRegistrationErrorEmail}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                    />
                  )}
                />
                {errors.email && (
                  <div className="error">{errors.email.message}</div>
                )}
                {registrationErrorEmail && (
                  <div className="error">{registrationErrorEmail}</div>
                )}
              </div>
              <div style={{ marginTop: "10px", width: "300px" }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    pattern: {
                      value: /^\d{9}$/,
                      message: "Phone number must contain 9 digits",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Phone Number
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      onFocus={() => {
                        setIsPhoneFocused(true);
                      }}
                      onBlur={() => setIsPhoneFocused(false)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                      InputProps={{
                        startAdornment: isPhoneFocused ? (
                          <InputAdornment position="start">+46</InputAdornment>
                        ) : null,
                      }}
                    />
                  )}
                />

                {errors.phoneNumber && (
                  <div className="error">{errors.phoneNumber.message}</div>
                )}
              </div>
              <div style={{ marginTop: "10px", width: "300px" }}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Password
                        </span>
                      }
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.password)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                      }}
                    />
                  )}
                />
                {errors.password && (
                  <div className="error">{errors.password.message}</div>
                )}
              </div>
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
                <span>Register Account</span>
              </Button>
            </div>
            <Link
              to={"/"}
              style={{
                textAlign: "center",
                fontSize: "14px",
                letterSpacing: "0px",
                display: "block",
                marginTop: "10px",
                color: "rgb(1, 103, 255)",
              }}
            >
              <span>Already have an account? Log in</span>
            </Link>
            {registrationError && (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "10px",
                }}
                className="error"
              >
                {registrationError}
              </div>
            )}
          </form>
        </div>
      )}
      {isAccountSavedMessageVisible && (
        <Dialog open={isAccountSavedMessageVisible} maxWidth="sm" fullWidth>
          <DialogContent
            style={{
              backgroundColor: "#2979ff",
              padding: "30px 0 30px 0",
              borderRadius: 5,
              margin: "30px auto",
              boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "90%",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            <div className="confirmation-message">
              Account registered successfully
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RegisterAccount;
