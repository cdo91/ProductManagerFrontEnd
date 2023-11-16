import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./RegisterProduct.css";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Check, Clear } from "@mui/icons-material";

interface Product {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: string;
}

const RegisterProduct = () => {

    const {
        handleSubmit, // Submit funktion för att skicka formuläret 
        control, // Kontrollerar inputfälten i formuläret 
        formState: { errors }, // Formstate för att kunna visa felmeddelanden
        reset, // Reset funktion för att rensa inputfälten i formuläret
    } = useForm<Product>(); // Sätter typen till Product som är en interface

    const [skuError, setSkuError] = useState<string | null>(null); // Sätter typen till string eller null
    const [errorUnauthorized, setErrorUnauthorized] = useState<string | null>(null); // Sätter typen till string eller null
    const [isRegisterProductVisible, setIsRegisterProductVisible] = useState(true); // Sätter typen till boolean
    const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false); // Sätter typen till boolean
    const [isProductSavedMessageVisible, setIsProductSavedMessageVisible] = useState(false); // Sätter typen till boolean
    const [formData, setFormData] = useState<Product | null>(null); // Sätter typen till Product eller null 
    const token = localStorage.getItem("token"); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et
    const navigate = useNavigate(); // Används för att kunna navigera till en annan sida

    const clearSkuError = () => { // Funktion för att rensa skuError
        setSkuError(null);
    };

    const onSubmit = async (data: Product) => {
      try {
        setIsConfirmationPromptVisible(true); // Visar bekräftelse prompt 
        setFormData(data); // Sparar data i variabeln formData
      } catch (error) { // Om det blir error när datan ska hämtas från API:et så loggas det ut i konsolen
        setErrorUnauthorized("Ej behörighet för utförande"); // Sparar ett error meddelande i variabeln errorUnauthorized
        console.error("Error:", error); // Loggar ut error i konsolen
      }
    };

  const handleConfirmYes = async (data: Product) => {
    try {
      const response = await fetch("https://localhost:1000/products", { // Skickar data till API:et
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sätter Content-Type till application/json
          Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
        },
        body: JSON.stringify(data), // Sparar data i body som skickas till API:et och konverterar datan till JSON format
      });

      if (response.ok) { // Om det går att skicka datan till API:et så körs koden nedan
        setIsConfirmationPromptVisible(false); // Stänger bekräftelse prompt
        setIsProductSavedMessageVisible(true); // Visar meddelande om att produkten är sparad
        setFormData(data); // Sparar data i variabeln formData
        setTimeout(() => {
          setIsProductSavedMessageVisible(false); // Stänger meddelandet om att produkten är sparad
          navigate("/Main"); // Navigerar till sidan Main
        }, 2000); // Väntar 2 sekunder innan den navigerar till sidan Main       
      } else if (response.status === 400) { // Om det blir error när datan ska skickas till API:et så körs koden nedan
        setIsConfirmationPromptVisible(false); // Stänger bekräftelse prompt
        setIsRegisterProductVisible(true); // Visar formuläret igen
        setSkuError("SKU finns redan"); // Sparar ett error meddelande i variabeln skuError
      }
    } catch (error) { // Om det blir error när datan ska skickas till API:et så loggas det ut i konsolen
      setIsConfirmationPromptVisible(false); // Stänger bekräftelse prompt
      setErrorUnauthorized("Ej behörighet för utförande"); // Sparar ett error meddelande i variabeln errorUnauthorized
      console.error("Error:", error); // Loggar ut error i konsolen
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false); // Stänger bekräftelse prompt
    setIsRegisterProductVisible(true); // Visar formuläret igen
    reset(); // Rensar inputfälten i formuläret
  };

  return (
    <>
      {isRegisterProductVisible && (
        <div
          className="register-product-container"
          style={{
            backgroundColor: "#d6d5d5",
            boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
            padding: "30px 0 30px 0",
            width: "30%",
            borderRadius: 5,
            margin: "30px auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              marginTop: "-23px",
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "10px",
            }}
          >
            <IconButton
              size="small"
              component={Link}
              to="/Main"
              className="link-to-adminmain"
            >
              <HomeIcon />
            </IconButton>
          </div>
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
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Namn måste vara ifylld." }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>Namn</span>}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.name)}
                        onFocus={clearSkuError}
                        style={{
                            width: "100%",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                      {errors.name && (
                        <div className="error">{errors.name.message}</div>
                      )}
                    </>
                  )}
                />
              </div>
              <div style={{ width: "300px", marginTop: "10px" }}>
                <Controller
                  name="sku"
                  control={control}
                  defaultValue=""
                  rules={{ required: "SKU måste vara ifylld" }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>SKU</span>}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.sku || Boolean(skuError))}
                        onFocus={clearSkuError}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                      {errors.sku && (
                        <div className="error">{errors.sku.message}</div>
                      )}
                      {skuError && <div className="error">{skuError}</div>}
                    </>
                  )}
                />
              </div>
              <div style={{ width: "300px", marginTop: "10px" }}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Beskrivning måste vara ifylld" }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        variant="outlined"
                        multiline
                        fullWidth
                        minRows={3}
                        error={Boolean(errors.description)}
                        label={
                          <span style={{ fontSize: "14px" }}>Beskrivning</span>
                        }
                        onFocus={clearSkuError}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                          border: "none",
                        }}
                      />
                      {errors.description && (
                        <div className="error">
                          {errors.description.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <div style={{ width: "300px", marginTop: "10px" }}>
                <Controller
                  name="imageUrl"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Bild (URL) måste vara ifylld",
                    pattern: {
                      value: /^https?:\/\/.+$/,
                      message: "Felaktig URL format.",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={
                          <span style={{ fontSize: "14px" }}>Bild (URL)</span>
                        }
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.imageUrl)}
                        onFocus={clearSkuError}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                      {errors.imageUrl && (
                        <div className="error">{errors.imageUrl.message}</div>
                      )}
                    </>
                  )}
                />
              </div>
              <div style={{ width: "300px", marginTop: "10px" }}>
                <Controller
                  name="price"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Pris måste vara ifylld",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Pris måste vara ett heltal",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>Pris</span>}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.price)}
                        onFocus={clearSkuError}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
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
                  width: "300px",
                  fontWeight: "bold",
                  textTransform: "none",
                  letterSpacing: "0px",
                }}
              >
                Registrera Produkt
              </Button>
              {errorUnauthorized && (
                <div
                  style={{ textAlign: "center", marginTop: "10px" }}
                  className="error"
                >
                  {errorUnauthorized}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {isConfirmationPromptVisible && (
        <Dialog
          open={isConfirmationPromptVisible}
          onClose={handleConfirmNo}
          maxWidth="md"
          fullWidth
        >
          <DialogContent
            style={{
              backgroundColor: "#d6d5d5",
              padding: "30px 0 30px 0",
              borderRadius: 5,
              margin: "30px auto",
              boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "93%",
              fontWeight: 600,
            }}
          >
            <p>Är detta korrekt?</p>
            <TableContainer
              component={Paper}
              style={{
                marginTop: "20px",
                border: "none",
                boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
                margin: "20px auto",
                width: "80%",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow className="tablehead">
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Bild (URL)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData && (
                    <TableRow className="alternate-row">
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.sku}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.description}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.imageUrl}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.price} SEK
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                color="primary"
                className="confirmation-prompt-button"
                onClick={() => {
                  if (formData) {
                    handleConfirmYes(formData);
                  }
                }}
                variant="contained"
                style={{
                  marginRight: 5,
                  borderRadius: "10rem",
                }}
              >
                <Check />
              </Button>
              <Button
                color="error"
                className="confirmation-prompt-button"
                onClick={handleConfirmNo}
                variant="contained"
                style={{
                  borderRadius: "10rem",
                }}
              >
                <Clear />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isProductSavedMessageVisible && (
        <Dialog
          open={isProductSavedMessageVisible}
          onClose={handleConfirmNo}
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
            <div className="confirmation-message">Produkt sparad</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RegisterProduct;
