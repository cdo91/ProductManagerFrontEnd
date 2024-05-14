import React, { useEffect, useState } from "react";
import "./SearchProduct.css";
import { useForm, Controller } from "react-hook-form";
import {
  Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Container, IconButton, Typography,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { Link, useNavigate } from "react-router-dom";
import { ProductProps } from "../add-product-to-category/AddProductToCategory.types";
import { CategoryProps } from "../add-category/AddCategory.types";

const SearchProduct = () => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductProps>();

  const [searchResultByName, setSearchResultByName] = useState<ProductProps[]>([]);
  const [searchResultBySku, setSearchResultBySku] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchedProductByCategory, setSearchedProductCountByCategory] = useState<{ [categoryId: number]: number }>({});
  const [error, setError] = useState("");
  const [searchOption, setSearchOption] = useState<"name" | "sku">("name");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const clearError = () => {
    setError("");
  };

  const clearSearchResults = () => {
    setSearchResultByName([]);
    setSearchResultBySku([]);
    setError("");
    reset({ name: "", sku: "" });
  };

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await fetch("https://app-productmanager.azurewebsites.net/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  const handleSearch = async (data: ProductProps) => {
    const { name, sku } = data;
    try {
      if (searchOption === "name") {
        const response = await fetch(
          `https://app-productmanager.azurewebsites.net/products?name=${name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 404) {
          setError("Product not found");
          setSearchResultByName([]);
        } else {
          const result = await response.json();
          const productsWithCategories = result.map((product: ProductProps) => {
            const category = categories.find((c) =>
              c.products.some((p) => p.id === product.id)
            );
            return { ...product, category };
          });

          const countByCategory: { [categoryId: number]: number } = {};
          categories.forEach((category) => {
            const count = productsWithCategories.filter(
              (product: { name: string; category: { id: number } }) =>
                product.category?.id === category.id &&
                product.name.toLowerCase() === name.toLowerCase()
            ).length;
            countByCategory[category.id] = count;
          });

          setSearchedProductCountByCategory(countByCategory);
          setSearchResultByName(productsWithCategories);
        }
      } else if (searchOption === "sku") {
        const response = await fetch(`https://app-productmanager.azurewebsites.net/products/${sku}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 404) {
          setError("Product not found");
          setSearchResultBySku([]);
        } else {
          const result = await response.json();
          setSearchResultBySku([result]);
        }
      }
    } catch (error) {
      setError("Unauthorized to perform action");
      setSearchResultByName([]);
      setSearchResultBySku([]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#d6d5d5",
        boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
        padding: "30px 0 30px 0",
        width: "50%",
        borderRadius: 5,
        margin: "30px auto",
      }}
      className="search-product-container"
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
      <form onSubmit={handleSubmit(handleSearch)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={searchOption}
            onChange={(_, newValue) => {
              setSearchOption(newValue as "name" | "sku");
              clearSearchResults();
            }}
            style={{
              marginLeft: 200,
              marginBottom: "5px",
              boxShadow: "2px 2px 2px rgba(68, 68, 68, 0.5)",
            }}
          >
            <ToggleButton
              value="name"
              style={{
                fontSize: "11px",
                height: "24px",
                backgroundColor: searchOption === "name" ? "#004c9c" : "white", 
                color: searchOption === "name" ? "white" : "black", 
                letterSpacing: "0px",
                textTransform: "none",
                width: "50px",
              }}
            >
              Name
            </ToggleButton>
            <ToggleButton
              value="sku"
              style={{
                fontSize: "11px",
                height: "24px",
                backgroundColor: searchOption === "sku" ? "#004c9c" : "white", 
                color: searchOption === "sku" ? "white" : "black",
                letterSpacing: "0px",
                textTransform: "none",
                width: "50px",
              }}
            >
              SKU
            </ToggleButton>
          </ToggleButtonGroup>
          <Controller
            name={searchOption === "name" ? "name" : "sku"}
            control={control}
            defaultValue=""
            rules={{
              required:
                searchOption === "name"
                  ? "Name is required"
                  : "SKU is required",
            }}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  type="text"
                  label={
                    <span style={{ fontSize: "14px" }}>
                      Search by {searchOption === "name" ? "Name" : "SKU"}
                    </span>
                  }
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors[searchOption] || Boolean(error))}
                  style={{
                    width: "300px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    boxShadow: "2px 2px 4px rgba(68, 68, 68, 0.5)",
                  }}
                  onFocus={clearError}
                />
                {errors[searchOption] && (
                  <div className="error">{errors[searchOption]?.message}</div>
                )}
                {error && <div className="error">{error}</div>}
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
            Search
          </Button>
        </div>
      </form>
  
      {searchOption === "name" && searchResultByName.length > 0 && (
  <div className="search-result">
    {searchResultByName
      .filter((product) =>
        categories.some(
          (category) =>
            product.category?.id === category.id &&
            searchedProductByCategory[category.id] > 0
        )
      )
      .map((product) => (
        <TableContainer
          component={Paper}
          key={product.id}
          style={{
            border: "none",
            boxShadow: "3px 3px 4px rgba(68, 68, 68, 0.5)",
            width: "90%",
            margin: "20px auto",
          }}
        >
          {categories
            .filter(
              (category) =>
                product.category?.id === category.id &&
                searchedProductByCategory[category.id] > 0
            )
            .map((category) => (
              <Table key={category.id}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        backgroundColor: "#004c9c",
                        color: "#fff",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{ fontWeight: "bold", fontSize: 16 }}
                      >
                        {category.name} (
                        {searchedProductByCategory[category.id] || 0})
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#1877c5" }}>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Image (URL)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Price
                    </TableCell>
                    {isAdmin && (
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          letterSpacing: "0px",
                        }}
                      >
                        Delete / Update
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={product.id}>
                    <TableCell
                      style={{
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      {product.sku}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      {product.description}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      {product.imageUrl}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      {product.price} SEK
                    </TableCell>
                    {isAdmin && (
                      <TableCell style={{ textAlign: "center" }}>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          size="small"
                          onClick={() =>
                            navigate("/DeleteProduct", {
                              state: { selectedProduct: product },
                            })
                          }
                        >
                          <DeleteIcon className="deleteIcon" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            navigate("/UpdateProduct", {
                              state: { sku: product.sku },
                            })
                          }
                          aria-label="Update"
                          color="primary"
                          size="small"
                        >
                          <UpdateIcon className="updateIcon" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            ))}
        </TableContainer>
      ))}
  </div>
)}


{searchOption === "sku" && searchResultBySku.length > 0 && (
  <div className="search-result">
    {searchResultBySku.map((product) => (
      <TableContainer
        component={Paper}
        key={product.id}
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
            <TableRow className="tablehead">
              <TableCell
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "0px",
                }}
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "0px",
                }}
              >
                SKU
              </TableCell>
              <TableCell
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "0px",
                }}
              >
                Description
              </TableCell>
              <TableCell
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "0px",
                }}
              >
                Image (URL)
              </TableCell>
              <TableCell
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  letterSpacing: "0px",
                }}
              >
                Price
              </TableCell>
              {isAdmin && (
                <TableCell
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    letterSpacing: "0px",
                  }}
                >
                  Delete / Update
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={product.id}>
              <TableCell
                style={{ textAlign: "center", letterSpacing: "0px" }}
              >
                {product.name}
              </TableCell>
              <TableCell
                style={{ textAlign: "center", letterSpacing: "0px" }}
              >
                {product.sku}
              </TableCell>
              <TableCell
                style={{ textAlign: "center", letterSpacing: "0px" }}
              >
                {product.description}
              </TableCell>
              <TableCell
                style={{ textAlign: "center", letterSpacing: "0px" }}
              >
                {product.imageUrl}
              </TableCell>
              <TableCell
                style={{ textAlign: "center", letterSpacing: "0px" }}
              >
                {product.price} SEK
              </TableCell>
              {isAdmin && (
                <TableCell style={{ textAlign: "center" }}>
                  <IconButton
                    aria-label="Delete"
                    color="error"
                    size="small"
                    onClick={() =>
                      navigate("/DeleteProduct", {
                        state: { selectedProduct: product },
                      })
                    }
                  >
                    <DeleteIcon className="deleteIcon" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      navigate("/UpdateProduct", {
                        state: { sku: product.sku },
                      })
                    }
                    aria-label="Update"
                    color="primary"
                    size="small"
                  >
                    <UpdateIcon className="updateIcon" />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    ))}
  </div>
)}

    </div>
  );
};

export default SearchProduct;
