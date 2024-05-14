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
import { CategoryProps } from "./AddCategory.types";


const AddCategory = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryProps>();

  const navigate = useNavigate();
  const [isRegisterCategoryVisible, setIsRegisterCategoryVisible] = useState(true);
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false);
  const [isCategorySavedMessageVisible, setIsCategorySavedMessageVisible] = useState(false);
  const [formData, setFormData] = useState<CategoryProps | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorUnauthorized, setErrorUnauthorized] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const clearError = () => {
    setErrorName(null);
  };

  const onSubmit = async (data: CategoryProps) => {
    setIsConfirmationPromptVisible(true);
    setFormData(data);
  };

  const handleConfirmYes = async (data: CategoryProps) => {
    try {
      const response = await fetch("https://app-productmanager.azurewebsites.net/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        setIsConfirmationPromptVisible(false);
        setIsCategorySavedMessageVisible(true);
        setFormData(data);

        setTimeout(() => {
          setIsCategorySavedMessageVisible(false);
          navigate("/Main");
        }, 2000);
      } else if (response.status === 400) {
        setIsConfirmationPromptVisible(false);
        setIsRegisterCategoryVisible(true);
        setErrorName("Name already exists");
      }
    } catch (error) {
      setErrorUnauthorized("Unauthorized to perform this action");
      console.error("Error:", error);
      setIsConfirmationPromptVisible(false);
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false);
    setIsRegisterCategoryVisible(true);
    reset();
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
                rules={{ required: "Name is required." }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      label={<span style={{ fontSize: "14px" }}>Name</span>}
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
                <span>Register Category</span>
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
            <span>Is this correct?</span>
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
                      <span>Name</span>
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
            <span>Category Saved</span>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddCategory;
