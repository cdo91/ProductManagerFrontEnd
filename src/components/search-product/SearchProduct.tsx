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

interface Product { 
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
  category: Category;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

type SearchFormInputs = {
  name: string;
  sku: string;
};

const SearchProduct = () => {
  const {
    handleSubmit, // Submit-funktionen från useForm som används för att skicka formuläret
    reset, // Reset-funktionen från useForm som rensar formuläret
    control, // Control-funktionen från useForm som används för att kontrollera formuläret
    formState: { errors }, // Formstate från useForm som används för att visa felmeddelanden
  } = useForm<SearchFormInputs>(); // Sätter typen till SearchFormInputs som är en interface

  const [searchResultByName, setSearchResultByName] = useState<Product[]>([]); // Sökresultat från API:et som sätts i variabeln searchResultByName 
  const [searchResultBySku, setSearchResultBySku] = useState<Product[]>([]); // Sökresultat från API:et som sätts i variabeln searchResultBySku
  const [categories, setCategories] = useState<Category[]>([]); // Kategorier från API:et som sätts i variabeln categories
  const [searchedProductByCategory, setSearchedProductCountByCategory] = useState<{ [categoryId: number]: number }>({}); // Räknar antalet produkter per kategori som sätts i variabeln searchedProductByCategory
  const [error, setError] = useState(""); // Sätter typen till string och sätter ett felmeddelande i variabeln error
  const [searchOption, setSearchOption] = useState<"name" | "sku">("name"); // Sätter typen till name eller sku och sätter name som default
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Sätter typen till boolean och kollar om användaren är admin eller inte genom att hämta isAdmin från localStorage
  const token = localStorage.getItem("token"); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et
  const navigate = useNavigate(); // Hämtar navigate från react-router-dom som används för att navigera mellan komponenter

  const clearError = () => { // Funktion som rensar error
    setError("");
  };

  const clearSearchResults = () => { // Funktion som rensar sökresultat
    setSearchResultByName([]);
    setSearchResultBySku([]);
    setError("");
    reset({ name: "", sku: "" });
  };

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await fetch("https://app-productmanager-prod.azurewebsites.net/categories", { // Hämtar data från API:et
          headers: {
            Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
          },
        });
        const data = await response.json(); // Sparar datan i variabeln data som sedan används för att sätta kategorierna i variabeln categories
        setCategories(data); // Sätter kategorierna i variabeln categories 
      } catch (error) { // Om det inte går att hämta data från API:et så körs koden nedan
        console.error(error); // Skriver ut error i konsolen
      }
    };
    fetchCategoriesAndProducts(); // Kör funktionen fetchCategoriesAndProducts
  }, []);

  const handleSearch = async (data: SearchFormInputs) => {
    const { name, sku } = data; // Sparar name och sku från data i variablerna name och sku
    try {
      if (searchOption === "name") { // Om searchOption är name så körs koden nedan
        const response = await fetch(
          `https://app-productmanager-prod.azurewebsites.net/products?name=${name}`, // Hämtar data från API:et
          {
            headers: {
              "Content-Type": "application/json", // Sätter Content-Type till application/json
              Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
            },
          }
        );
        if (response.status === 404) { // Om det inte går att hämta data från API:et så körs koden nedan
          setError("Produkt saknas"); // Sparar ett felmeddelande i variabeln error
          setSearchResultByName([]); // Rensar searchResultByName
        } else {
          const result = await response.json(); // Sparar datan i variabeln result som sedan används för att sätta produkterna i variabeln searchResultByName
          const productsWithCategories = result.map((product: Product) => { // Sparar datan i variabeln productsWithCategories som sedan används för att sätta produkterna i variabeln searchResultByName
            const category = categories.find((c) => // Sparar kategorin i variabeln category som sedan används för att sätta produkterna i variabeln searchResultByName
              c.products.some((p) => p.id === product.id) // Sparar produkterna i variabeln products som sedan används för att sätta produkterna i variabeln searchResultByName
            );
            return { ...product, category }; // Returnerar produkterna och kategorin
          });

          const countByCategory: { [categoryId: number]: number } = {}; // Sparar antalet produkter per kategori i variabeln countByCategory
          categories.forEach((category) => { // Sparar kategorin i variabeln category som sedan används för att sätta produkterna i variabeln countByCategory
            const count = productsWithCategories.filter( // Filtrerar produkterna i variabeln productsWithCategories och sparar dem i variabeln count som sedan används för att sätta produkterna i variabeln countByCategory
              (product: { name: string; category: { id: number } }) => // Sparar produkterna i variabeln product som sedan används för att sätta produkterna i variabeln countByCategory
                product.category?.id === category.id && // Sparar kategorin i variabeln category som sedan används för att sätta produkterna i variabeln countByCategory
                product.name.toLowerCase() === name.toLowerCase() // Sparar produktnamnet i variabeln name som sedan används för att sätta produkterna i variabeln countByCategory
            ).length;
            countByCategory[category.id] = count; // Sparar antalet produkter per kategori i variabeln countByCategory
          });

          setSearchedProductCountByCategory(countByCategory); // Sätter antalet produkter per kategori i variabeln searchedProductByCategory
          setSearchResultByName(productsWithCategories); // Sätter produkterna i variabeln searchResultByName
        }
      } else if (searchOption === "sku") { // Om searchOption är sku så körs koden nedan
        const response = await fetch(`https://app-productmanager-prod.azurewebsites.net/products/${sku}`, { // Hämtar data från API:et
          headers: {
            "Content-Type": "application/json", // Sätter Content-Type till application/json
            Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
          },
        });
        if (response.status === 404) { // Om det inte går att hämta data från API:et så körs koden nedan
          setError("Produkt saknas"); // Sparar ett felmeddelande i variabeln error
          setSearchResultBySku([]); // Rensar searchResultBySku
        } else {
          const result = await response.json(); // Sparar datan i variabeln result som sedan används för att sätta produkterna i variabeln searchResultBySku
          setSearchResultBySku([result]); // Sätter produkterna i variabeln searchResultBySku
        }
      }
    } catch (error) { // Om det inte går att hämta data från API:et så körs koden nedan
      setError("Ej behörighet för utförande"); // Sparar ett felmeddelande i variabeln error
      setSearchResultByName([]); // Rensar searchResultByName
      setSearchResultBySku([]); // Rensar searchResultBySku
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
              Namn
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
              Sku
            </ToggleButton>
          </ToggleButtonGroup>
          <Controller
            name={searchOption === "name" ? "name" : "sku"}
            control={control}
            defaultValue=""
            rules={{
              required:
                searchOption === "name"
                  ? "Namn måste vara ifyllt"
                  : "SKU måste vara ifyllt",
            }}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  type="text"
                  label={
                    <span style={{ fontSize: "14px" }}>
                      Sök på {searchOption === "name" ? "Namn" : "Sku"}
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
            Sök
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
                            Namn
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
                            Beskrivning
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              textAlign: "center",
                              letterSpacing: "0px",
                            }}
                          >
                            Bild (URL)
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              textAlign: "center",
                              letterSpacing: "0px",
                            }}
                          >
                            Pris
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
                              Ta bort / Uppdatera
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
                      Namn
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
                      Beskrivning
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Bild (URL)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        letterSpacing: "0px",
                      }}
                    >
                      Pris
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
                        Ta bort / Uppdatera
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
