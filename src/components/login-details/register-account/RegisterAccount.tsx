import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField, Button, Container,
  Avatar, Typography, InputAdornment, Dialog, DialogContent,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface RegistrationForm {
  userName: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  address: string;
  city: string;
  zipCode: number;
  email: string;
  phoneNumber: string;
  password: string;
  admin: boolean;
}

const RegisterAccount = () => {
  const {
    handleSubmit, // Submit funktion som skickar iväg datan till API:et
    control, // React-hook-form funktion som används för att kontrollera inputfälten i formuläret
    formState: { errors }, // Formstate som används för att visa felmeddelanden
  } = useForm<RegistrationForm>(); // Sätter typen på datan som skickas till API:et till RegistrationForm

  const [registrationError, setRegistrationError] = useState<string | null>(null); // State som används för att visa felmeddelande om registreringen misslyckas
  const [registrationErrorUserName, setRegistrationErrorUserName] = useState<string | null>(null); // State som används för att visa felmeddelande om användarnamnet redan existerar
  const [registrationErrorEmail, setRegistrationErrorEmail] = useState<string | null>(null); // State som används för att visa felmeddelande om emailen redan existerar
  const [isRegisterAccountVisible, setIsRegisterAccountVisible] = useState(true); // State som används för att visa registreringsformuläret
  const [isAccountSavedMessageVisible, setIsAccountSavedMessageVisible] = useState(false); // State som används för att visa bekräftelsemeddelandet när kontot har skapats
  const [isPhoneFocused, setIsPhoneFocused] = useState(false); // State som används för att visa +46 i inputfältet för telefonnummer
  const navigate = useNavigate(); // React-router-dom funktion som används för att navigera till en annan sida

  const clearRegistrationErrorUserName = () => { // Funktion som används för att rensa bort felmeddelandet om användarnamnet redan existerar
    setRegistrationErrorUserName(null);
  };

  const clearRegistrationErrorEmail = () => { // Funktion som används för att rensa bort felmeddelandet om emailen redan existerar
    setRegistrationErrorEmail(null);
  };

  const onSubmit = async (data: RegistrationForm) => {
    try {
      data.admin = false; // Sätter admin till false eftersom det inte går att registrera sig som admin
      data.phoneNumber = "+46" + data.phoneNumber; // Lägger till +46 framför telefonnumret

      if (data.birthDate) { // Om birthDate inte är null så sätts det till UTC
        const birthDate = new Date(data.birthDate); // Skapar ett nytt Date objekt av birthDate
        const utcBirthDate = new Date( // Skapar ett nytt Date objekt av birthDate som är i UTC (Universal Time Coordinated)
          Date.UTC(
            birthDate.getFullYear(), // getFullYear() returnerar ett år som en fyrsiffrig siffra
            birthDate.getMonth(), // getMonth() returnerar månaden
            birthDate.getDate(), // getDate() returnerar dagen i månaden
            birthDate.getHours(), // getHours() returnerar timmen
            birthDate.getMinutes(), // getMinutes() returnerar minuten
            birthDate.getSeconds() // getSeconds() returnerar sekunden
          )
        );
        data.birthDate = utcBirthDate; // Sätter birthDate till utcBirthDate
      } else {
        data.birthDate = null; // Om birthDate är null så sätts det till null
      }

      const response = await fetch("https://app-productmanager-prod.azurewebsites.net/login/register-account", { // Skickar datan till API:et
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sätter Content-Type till application/json
        },
        body: JSON.stringify(data), // Gör om datan till en sträng och skickar med den till API:et
      });

      if (response.ok) { // Om registreringen lyckas så visas bekräftelsemeddelandet och användaren skickas till AdminMain.tsx
        setIsRegisterAccountVisible(false); // Döljer registreringsformuläret
        setIsAccountSavedMessageVisible(true); // Visar bekräftelsemeddelandet
        setTimeout(() => {
          setIsAccountSavedMessageVisible(false); // Döljer bekräftelsemeddelandet efter 2 sekunder
          navigate("/"); // Skickar användaren till AdminMain.tsx
        }, 2000); // efter 2 sekunder
      } else if (response.status === 400) { // Om registreringen misslyckas så visas felmeddelandet
        const responseData = await response.json(); // Sparar datan från API:et i variabeln responseData
        if (responseData.errorType === "both") { // Om både användarnamnet och emailen redan existerar så visas felmeddelandet för båda
          setRegistrationErrorUserName("Användarnamn existerar redan");
          setRegistrationErrorEmail("Email existerar redan");
        } else if (responseData.errorType === "userName") { // Om användarnamnet redan existerar så visas felmeddelandet för användarnamnet
          setRegistrationErrorUserName("Användarnamn existerar redan");
        } else if (responseData.errorType === "email") { // Om emailen redan existerar så visas felmeddelandet för emailen
          setRegistrationErrorEmail("Email existerar redan");
        }
      }
    } catch (error) { // Om det blir error när datan ska skickas till API:et så loggas det ut i konsolen
      console.error("Error:", error); // Loggar ut error i konsolen
      setRegistrationError("Misslyckat registreringsförsök. Försök igen"); // Visar felmeddelandet
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
            Bli medlem
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
                          Användarnamn
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
                    rules={{ required: "Förnamn är obligatorisk" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Förnamn
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
                    rules={{ required: "Efternamn är obligatorisk" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Efternamn
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
                  rules={{ required: "Födelsedatum är obligatorisk" }}
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
                            Födelsedatum
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
                  rules={{ required: "Adress är obligatorisk" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span
                          style={{ fontSize: "14px", letterSpacing: "0px" }}
                        >
                          Adress
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
                    rules={{ required: "Stad är obligatorisk" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Stad
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
                      required: "Pnr är obligatorisk",
                      pattern: {
                        value: /^\d{5}$/,
                        message: "Pnr består av 5 siffror",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <span
                            style={{ fontSize: "14px", letterSpacing: "0px" }}
                          >
                            Postnummer
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
                      message: "Telefonnumret måste innehålla 9 siffror",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<span style={{ fontSize: "14px", letterSpacing: "0px" }}>Telefonnummer</span>}
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
                      label={<span style={{ fontSize: "14px", letterSpacing: "0px" }}>Lösenord</span>
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
                <span>Registrera konto</span> 
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
              <span>Har du redan ett konto? Logga in</span> 
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
        <Dialog
        open={isAccountSavedMessageVisible}
        maxWidth="sm"
        fullWidth
      >
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
          <div className="confirmation-message">Kontot är registrerat</div>
        </DialogContent>
      </Dialog>
      )}
    </>
  );
};

export default RegisterAccount;
