import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./AddCategory.css";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Check, Clear } from "@mui/icons-material";

interface Category {
  name: string;
}

const AddCategory = () => {
  const {
    handleSubmit, // För att kunna skicka formuläret
    control, // För att kunna använda react-hook-form med MUI
    formState: { errors }, // För att kunna visa felmeddelanden
    reset, // Återställer formuläret
  } = useForm<Category>(); // Typ av formulärdata

  const navigate = useNavigate(); // För att kunna navigera till en annan sida
  const [isRegisterCategoryVisible, setIsRegisterCategoryVisible] = useState(true); // Visar registreringsformuläret
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false); // Visar bekräftelseprompten
  const [isCategorySavedMessageVisible, setIsCategorySavedMessageVisible] = useState(false); // Visar bekräftelsemeddelandet
  const [formData, setFormData] = useState<Category | null>(null); // Formulärdata som ska skickas till API:et
  const [errorName, setErrorName] = useState<string | null>(null); // Felmeddelande för namn
  const [errorUnauthorized, setErrorUnauthorized] = useState<string | null>(null); // Felmeddelande för att användaren inte är inloggad
  const token = localStorage.getItem("token"); // Hämtar token från local storage för att få tillgång till API:et

  const clearError = () => { // Rensar felmeddelandet för namn
    setErrorName(null);
  };

  const onSubmit = async (data: Category) => { // Skickar formulärdata till API:et
    setIsConfirmationPromptVisible(true); // Visar bekräftelseprompten
    setFormData(data); // Sparar formulärdata i formData
  };

  const handleConfirmYes = async (data: Category) => {
    try {
      const response = await fetch("https://app-productmanager-prod.azurewebsites.net/categories", { // Skickar formulärdata till API:et
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Skickar med token för att få tillgång till API:et
        },
        body: JSON.stringify(data), // Formulärdata som ska skickas till API:et
      });

      if (response.ok) { // Om kategorin skapades
        reset(); // Rensar formuläret
        setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
        setIsCategorySavedMessageVisible(true); // Visar bekräftelsemeddelandet
        setFormData(data); // Sparar formulärdata i formData

        setTimeout(() => { // Timer för att visa bekräftelsemeddelandet
          setIsCategorySavedMessageVisible(false); // Gömmer bekräftelsemeddelandet
          navigate("/Main"); // Navigerar till Main
        }, 2000); // Efter 2 sekunder
      } else if (response.status === 400) { // Om Kategorin redan finns
        setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
        setIsRegisterCategoryVisible(true); // Visar registreringsformuläret
        setErrorName("Namn finns redan"); // Visar felmeddelande för namn
      }
    } catch (error) { // Om något gick fel
      setErrorUnauthorized("Ej behörighet för utförande "); // Visar felmeddelande för att användaren inte är inloggad
      console.error("Error:", error); // Skriver ut felmeddelande i konsolen
      setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
    setIsRegisterCategoryVisible(true); // Visar registreringsformuläret
    reset(); // Rensar formuläret
  };

  return (
    <>
      {isRegisterCategoryVisible && (
        <div className="register-category-container">
          <div className="icon-button-container">
            <IconButton size="small" component={Link} to="/Main">
              <HomeIcon />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-container">
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
                      error={Boolean(errors.name) || Boolean(errorName)}
                      onFocus={clearError}
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
                    {errorName && <div className="error">{errorName}</div>}
                    {errorUnauthorized && (
                      <div className="error">{errorUnauthorized}</div>
                    )}
                  </>
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  marginTop: 10,
                  height: 44.5,
                  width: "300px",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0px",
                }}
              >
                <span>Registrera Kategori</span>
              </Button>
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
            <span>Är detta korrekt?</span>
            <TableContainer
              component={Paper}
              style={{
                marginTop: "20px",
                border: "none",
                boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
                width: "300px",
                margin: "20px auto",
              }}
            >
              <Table>
                <TableHead className="tablehead">
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      <span>Namn</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData && (
                    <TableRow className="alternate-row">
                      <TableCell style={{ textAlign: "center" }}>
                        {formData.name}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="button-container">
              <Button
                color="primary"
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
                variant="contained"
                onClick={handleConfirmNo}
                style={{ borderRadius: "10rem" }}
              >
                <Clear />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isCategorySavedMessageVisible && (
        <Dialog
          open={isCategorySavedMessageVisible}
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
              fontWeight: 600,
              color: "#fff",
              width: "90%",
            }}
          >
            <span>Kategori sparad</span>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddCategory;
