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
import { ProductProps } from "../add-product-to-category/AddProductToCategory.types";

const RegisterProduct = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductProps>();

  const [skuError, setSkuError] = useState<string | null>(null);
  const [errorUnauthorized, setErrorUnauthorized] = useState<string | null>(null);
  const [isRegisterProductVisible, setIsRegisterProductVisible] = useState(true);
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false);
  const [isProductSavedMessageVisible, setIsProductSavedMessageVisible] = useState(false);
  const [formData, setFormData] = useState<ProductProps | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const clearSkuError = () => {
    setSkuError(null);
  };

  const onSubmit = async (data: ProductProps) => {
    try {
      setIsConfirmationPromptVisible(true);
      setFormData(data);
    } catch (error) {
      setErrorUnauthorized("Unauthorized to perform");
      console.error("Error:", error);
    }
  };

  const handleConfirmYes = async (data: ProductProps) => {
    try {
      const response = await fetch(
        "https://app-productmanager.azurewebsites.net/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsConfirmationPromptVisible(false);
        setIsProductSavedMessageVisible(true);
        setFormData(data);
        setTimeout(() => {
          setIsProductSavedMessageVisible(false);
          navigate("/Main");
        }, 2000);
      } else if (response.status === 400) {
        setIsConfirmationPromptVisible(false);
        setIsRegisterProductVisible(true);
        setSkuError("SKU already exists");
      }
    } catch (error) {
      setIsConfirmationPromptVisible(false);
      setErrorUnauthorized("Unauthorized to perform");
      console.error("Error:", error);
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false);
    setIsRegisterProductVisible(true);
    reset();
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
                  rules={{ required: "Name is required." }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>Name</span>}
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
                  rules={{ required: "SKU is required." }}
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
                  rules={{ required: "Description is required" }}
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
                          <span style={{ fontSize: "14px" }}>Description</span>
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
                    required: "Image (URL) is required.",
                    pattern: {
                      value: /^https?:\/\/.+$/,
                      message: "Invalid URL format.",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={
                          <span style={{ fontSize: "14px" }}>Image (URL)</span>
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
                  defaultValue={undefined}
                  rules={{
                    required: "Price is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Price is required",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label={<span style={{ fontSize: "14px" }}>Price</span>}
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
                Register Product
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
            <p>Is this correct?</p>
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
                      Image (URL)
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
                        {formData.price} $
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
            <div className="confirmation-message">Product saved</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RegisterProduct;
