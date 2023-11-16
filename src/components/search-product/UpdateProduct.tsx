import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField, Button, Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogContent, IconButton,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Check, Clear } from "@mui/icons-material";

interface Product {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: string;
}

const UpdateProduct = () => {
  const {
    handleSubmit, // Submit funktion som skickar data till API:et 
    control, // Kontrollerar inputfälten 
    formState: { errors }, // Formstate som används för att visa felmeddelanden
    reset, // Reset funktion som rensar inputfälten
  } = useForm<Product>(); // Sätter typen till Product som är en interface


  const [isUpdateInputVisible, setIsUpdateInputVisible] = useState(true); // Sätter typen till boolean
  const [isUpdateConfirmationVisible, setIsUpdateConfirmationVisible] = useState(false); // Sätter typen till boolean
  const [isProductUpdatedMessageVisible, setIsProductUpdatedMessageVisible] = useState(false); // Sätter typen till boolean
  // Sätter typen till Product eller null och används för att spara data från inputfälten som sedan skickas till API:et för att uppdatera produkten 
  const [formData, setFormData] = useState<Product | null>(null);
  const navigate = useNavigate(); // Hämtar navigate från react-router-dom som används för att navigera mellan komponenter
  const token = localStorage.getItem("token"); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et
  const location = useLocation(); // Hämtar location från react-router-dom som används för att skicka med data mellan komponenter
  const initialSku = location.state?.sku || ""; // Sparar sku från location i variabeln initialSku som skickas med från komponenten SearchProduct


  const handleConfirmNo = () => { // 
    reset({ // Rensar inputfälten
      name: "", 
      description: "", 
      imageUrl: "", 
      price: "", 
    });
    setIsUpdateInputVisible(true);  // Visar inputfälten
    setIsUpdateConfirmationVisible(false); // Döljer bekräftelseprompten
  };

  const handleConfirmYes = async (data: Product) => {
    try {
      const response = await fetch(
        `https://app-productmanager-prod.azurewebsites.net/products/${data.sku}`, // Hämtar data från API:et
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Sätter Content-Type till application/json
            Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
          },
          body: JSON.stringify(data), // Skickar med data från inputfälten till API:et
        }
      );
      if (response.ok) { // Om det går att hämta data från API:et så körs koden nedan
        setIsUpdateConfirmationVisible(false); // Döljer bekräftelseprompten
        setIsProductUpdatedMessageVisible(true); // Visar meddelande om att produkten är uppdaterad
        setFormData(data); // Sparar data från inputfälten i variabeln formData
        setTimeout(() => {
          setIsProductUpdatedMessageVisible(false); // Döljer meddelandet om att produkten är uppdaterad
          navigate("/Main"); // Navigerar tillbaka till Main
        }, 2000); // Efter 2 sekunder
      }
    } catch (error) { // Om det inte går att hämta data från API:et så loggas ett felmeddelande ut i konsolen
      console.error("Error:", error); // Loggar ut error i konsolen
    }
  };

  const onSubmit = async (data: Product) => {
    setIsUpdateConfirmationVisible(true); // Visar bekräftelseprompten
    setFormData(data); // Sparar data från inputfälten i variabeln formData
  };

  return (
    <>
      {isUpdateInputVisible && (
        <Container
          className="register-product-container"
          style={{
            backgroundColor: "#d6d5d5",
            boxShadow: "3px 3px 10px rgba(68, 68, 68, 0.5)",
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
                        style={{
                          width: "300px",
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
                  defaultValue={initialSku}
                  rules={{ required: "SKU måste vara ifylld" }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>SKU</span>}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors.sku)}
                        disabled
                        style={{
                          width: "300px",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 2px rgba(126, 125, 125, 0.5)",
                        }}
                      />
                      {errors.sku && (
                        <div className="error">{errors.sku.message}</div>
                      )}
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
                        style={{
                          width: "300px",
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
                        style={{
                          width: "300px",
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
                        style={{
                          width: "300px",
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
                  marginTop: "10px",
                  height: 44.5,
                  width: "300px",
                  fontWeight: "bold",
                  textTransform: "none",
                  letterSpacing: "0px",
                }}
              >
                <p>Uppdatera</p>
              </Button>
            </div>
          </form>
        </Container>
      )}

      {isUpdateConfirmationVisible && (
        <Dialog
          open={isUpdateConfirmationVisible}
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
                width: "80%",
                margin: "20px auto",
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
                        {formData.price}
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
                variant="contained"
                onClick={() => {
                  if (formData) {
                    handleConfirmYes(formData);
                  }
                }}
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

      {isProductUpdatedMessageVisible && (
        <Dialog
          open={isProductUpdatedMessageVisible}
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
            <p>Produkt uppdaterad</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UpdateProduct;
