import React, { useEffect, useState } from "react";
import "./AddProductToCategory.css";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button, TextField, Table, TableBody, TableCell, TableContainer,TableHead, 
  TableRow, Paper, IconButton, Typography, Dialog, DialogContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Check, Clear } from "@mui/icons-material";
import { ProductProps } from "./AddProductToCategory.types";
import { CategoryProps } from "../add-category/AddCategory.types";

const AddProductToCategory = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductProps>();

  const [searchResult, setSearchResult] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(true);
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false);
  const [isProductSavedToCategoryMessage, setIsProductSavedToCategoryMessage] = useState(false);
  const [formDataProduct, setFormDataProduct] = useState<ProductProps | null>(null);
  const [formDataCategory, setFormDataCategory] = useState<CategoryProps | null>(null);
  const [errorUnauthorized, setErrorUnauthorized] = useState("");
  const [errorUnauthorizedSecond, setErrorUnauthorizedSecond] = useState("");
  const [errorProductAlreadyExists, setErrorProductAlreadyExists] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const clearError = () => {
    setErrorUnauthorized("");
    setErrorProductAlreadyExists("");
  };

  const onSubmit = async (data: ProductProps) => {
    const { sku } = data;
    try {
      const response = await fetch(
        `https://app-productmanager.azurewebsites.net/products/${sku}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 404) {
          setErrorUnauthorized("Product not found");
        }
        return;
      }
      const result = await response.json();
      setSearchResult([result]);
    } catch (error) {
      setErrorUnauthorized("Unauthorized to perform action");
      console.error("Error:", error);
      setSearchResult([]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        categories.sort((a: CategoryProps, b: CategoryProps) => a.id - b.id);
        const response = await fetch(
          "https://app-productmanager.azurewebsites.net/categories/categories-only",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const categoriesData = await response.json();
          categoriesData.sort(
            (a: CategoryProps, b: CategoryProps) => a.id - b.id
          );
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchCategories();
  }, []);

  const addProductToCategory = async (
    categoryId: number,
    productId: number
  ) => {
    const selectedProduct = searchResult.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      const selectedCategory = categories.find(
        (category) => category.id === categoryId
      );
      if (selectedCategory) {
        const { id, name, sku, description, imageUrl, price } = selectedProduct;
        const productData = {
          id,
          name,
          sku,
          description,
          imageUrl,
          price,
          productId,
          categoryId,
          category: selectedCategory
        };
        setFormDataProduct(productData);
        setFormDataCategory(selectedCategory);
        setIsConfirmationPromptVisible(true);
      }
    }
  };

  const handleConfirmYes = async () => {
    try {
      const categoryId = formDataCategory?.id;
      const productId = formDataProduct?.id;

      if (categoryId && productId) {
        const response = await fetch(
          `https://app-productmanager.azurewebsites.net/categories/${categoryId}/products/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201 || response.status === 204) {
          setSearchResult([]);
          reset();
          setIsProductSavedToCategoryMessage(true);
          setIsConfirmationPromptVisible(false);
          setTimeout(() => {
            setIsProductSavedToCategoryMessage(false);
            navigate("/Main");
          }, 2000);
        } else if (response.status === 400) {
          setIsConfirmationPromptVisible(false);
          setErrorProductAlreadyExists(
            "Product already exists in the selected category"
          );
        }
      }
    } catch (error) {
      setErrorUnauthorizedSecond("Unauthorized to perform action");
      console.error("Error:", error);
      setIsConfirmationPromptVisible(false);
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false);
    setIsSearchFormVisible(true);
    reset();
    setSearchResult([]);
  };

  return (
    <>
      {isSearchFormVisible && (
        <div className="register-product-to-category-container">
          <div className="icon-button-container">
            <IconButton size="small" component={Link} to="/Main">
              <HomeIcon />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-container">
              <Controller
                name="sku"
                control={control}
                defaultValue=""
                rules={{ required: "SKU is required" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      label={
                        <span style={{ fontSize: "14px" }}>Search by SKU</span>
                      }
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.sku || Boolean(errorUnauthorized))}
                      style={{
                        width: "300px",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 4px rgba(68, 68, 68, 0.5)",
                      }}
                      onFocus={clearError}
                    />
                    {errors.sku && (
                      <div className="error">{errors.sku.message}</div>
                    )}
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
                  boxShadow: "2px 2px 4px rgba(68, 68, 68, 0.5)",
                  marginTop: "7px",
                  height: 40,
                  width: "300px",
                  fontWeight: "bold",
                  textTransform: "none",
                  letterSpacing: "0px",
                }}
              >
                <span>Search</span>
              </Button>
            </div>
          </form>

          {searchResult.length > 0 && (
            <TableContainer
              component={Paper}
              style={{
                marginTop: "20px",
                border: "none",
                boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
                width: "90%",
                margin: "20px auto",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        backgroundColor: "#004c9c",
                        color: "#fff",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold", fontSize: 16 }}>
                        Product
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#1877c5" }}>
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
                  {searchResult.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.sku}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.description}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.imageUrl}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.price} $
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {searchResult.length > 0 && categories.length > 0 && (
            <div>
              <TableContainer
                component={Paper}
                style={{
                  marginTop: "20px",
                  border: "none",
                  boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
                  width: "90%",
                  margin: "20px auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          backgroundColor: "#004c9c",
                          color: "#fff",
                        }}
                      >
                        <span style={{ fontWeight: "bold", fontSize: 16 }}>
                          Categories
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: "#1877c5" }}>
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: 100,
                        }}
                      >
                        Id
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: 100,
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: 100,
                        }}
                      >
                        Add Product
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow
                        key={category.id}
                        className={
                          index % 2 === 0 ? "table-row-even" : "table-row-odd"
                        }
                      >
                        <TableCell style={{ textAlign: "center" }}>
                          {category.id}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {category.name}
                        </TableCell>
                        <TableCell
                          style={{
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          <IconButton
                            aria-label="Add"
                            color="primary"
                            size="small"
                            onClick={() => {
                              if (searchResult.length > 0) {
                                addProductToCategory(
                                  category.id,
                                  searchResult[0].id
                                );
                              }
                            }}
                            disabled={searchResult.length === 0}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {errorUnauthorizedSecond && (
                <div style={{ textAlign: "center" }} className="error">
                  {errorUnauthorizedSecond}
                </div>
              )}
              {errorProductAlreadyExists && (
                <div style={{ textAlign: "center" }} className="error">
                  {errorProductAlreadyExists}
                </div>
              )}
            </div>
          )}
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
                width: "90%",
                margin: "20px auto",
                textAlign: "center",
              }}
            >
              <Table>
                <TableHead className="tablehead">
                  {formDataCategory && (
                    <TableRow>
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: 16,
                          backgroundColor: "#004c9c",
                        }}
                        colSpan={5}
                      >
                        {formDataCategory.name}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow style={{ backgroundColor: "#1877c5" }}>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Name</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>SKU</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Description</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Image (URL)</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Price</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formDataProduct && (
                    <TableRow className="alternate-row-odd">
                      <TableCell style={{ textAlign: "center" }}>
                        {formDataProduct.name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formDataProduct.sku}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formDataProduct.description}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formDataProduct.imageUrl}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {formDataProduct.price} $
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
                  if (formDataProduct) {
                    handleConfirmYes();
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
      {isProductSavedToCategoryMessage && (
        <Dialog open={isProductSavedToCategoryMessage} maxWidth="sm" fullWidth>
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
            <span>Product added to category</span>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddProductToCategory;
