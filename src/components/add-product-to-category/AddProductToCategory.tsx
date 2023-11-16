import React, { useEffect, useState } from "react";
import "./AddProductToCategory.css";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Check, Clear } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface Category {
  // Interface för kategorier som används för att hämta kategorier från databasen
  id: number;
  name: string;
}

type SearchFormInputs = {
  // Form inputs som används i useForm hooken för att validera formuläret
  sku: string;
};

const AddProductToCategory = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SearchFormInputs>();

  const [searchResult, setSearchResult] = useState<Product[]>([]); // State för att lagra sökresultatet från databasen
  const [categories, setCategories] = useState<Category[]>([]); // State för att lagra kategorier från databasen
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(true); // State för att visa sökformuläret
  const [isConfirmationPromptVisible, setIsConfirmationPromptVisible] = useState(false); // State för att visa bekräftelseprompten
  const [isProductSavedToCategoryMessage, setIsProductSavedToCategoryMessage] = useState(false); // State för att visa meddelandet om att produkten har lagts till i kategorin
  const [formDataProduct, setFormDataProduct] = useState<Product | null>(null); // State för att lagra produktdata från sökresultatet
  const [formDataCategory, setFormDataCategory] = useState<Category | null>(null); // State för att lagra kategoridata från kategorilistan
  const [errorUnauthorized, setErrorUnauthorized] = useState(""); // State för att visa felmeddelande om användaren inte är behörig för att utföra operationen
  const [errorUnauthorizedSecond, setErrorUnauthorizedSecond] = useState("");
  const [errorProductAlreadyExists, setErrorProductAlreadyExists] = useState(""); // State för att visa felmeddelande om produkten redan finns i kategorin
  const navigate = useNavigate(); // Hook för att navigera mellan sidor
  const token = localStorage.getItem("token"); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et

  const clearError = () => { // Funktion för att rensa felmeddelanden
    setErrorUnauthorized("");
    setErrorProductAlreadyExists("");
  };

  const onSubmit = async (data: SearchFormInputs) => {
    const { sku } = data;
    try {
      const response = await fetch(`https://app-productmanager-prod.azurewebsites.net/products/${sku}`, { // Fetchar produkten från databasen med hjälp av sku
        headers: {
          "Content-Type": "application/json", // Sätter Content-Type till application/json
          Authorization: `Bearer ${token}`, // Sätter Authorization till token
        },
      });
      if (!response.ok) { // Om svaret inte är ok
        if (response.status === 404) { // Om status är 404
          setErrorUnauthorized("Produkt saknas"); // Sätt felmeddelande till 'Produkt saknas'
        }
        return;
      }
      const result = await response.json(); // Om svaret är ok, konvertera svaret till json
      setSearchResult([result]); // Sätt sökresultatet till det konverterade svaret
    } catch (error) { // Om det blir error
      setErrorUnauthorized("Ej behöriget för utförande"); // Sätt felmeddelande till 'Ej behöriget för utförande'
      console.error("Error:", error); // Logga error till konsolen
      setSearchResult([]); // Rensa sökresultatet
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        categories.sort((a: Category, b: Category) => a.id - b.id); // Sorterar kategorier efter id
        const response = await fetch(
          "https://app-productmanager-prod.azurewebsites.net/categories/categories-only", // Fetchar kategorier från databasen
          {
            headers: {
              "Content-Type": "application/json", // Sätter Content-Type till application/json
              Authorization: `Bearer ${token}`, // Sätter Authorization till token
            },
          }
        );
        if (response.ok) { // Om svaret är ok
          const categoriesData = await response.json(); // Konvertera svaret till json
          categoriesData.sort((a: Category, b: Category) => a.id - b.id); // Sorterar kategorier efter id
          setCategories(categoriesData); // Sätt kategorier till det konverterade svaret
        }
      } catch (error) { // Om det blir error
        console.error("Error", error); // Logga error till konsolen
      }
    };
    fetchCategories(); // Kör funktionen fetchCategories
  }, []);

  const addProductToCategory = async (
    categoryId: number,
    productId: number
  ) => { // Funktion för att lägga till produkt till kategori
    const selectedProduct = searchResult.find( // Hämtar produkt från sökresultatet med hjälp av productId
      (product) => product.id === productId // Om productId matchar produktens id
    );
    if (selectedProduct) {
      const selectedCategory = categories.find( // Hämtar kategori från kategorilistan med hjälp av categoryId
        (category) => category.id === categoryId // Om categoryId matchar kategoriens id
      );
      if (selectedCategory) {
        const { id, name, sku, description, imageUrl, price } = selectedProduct; // Hämtar produktdata från selectedProduct
        const productData = { // Skapar ett objekt med produktdata
          id,
          name,
          sku,
          description,
          imageUrl,
          price,
          productId,
          categoryId,
        };
        setFormDataProduct(productData); // Sätter produktdata till formDataProduct
        setFormDataCategory(selectedCategory); // Sätter kategoridata till formDataCategory
        setIsConfirmationPromptVisible(true); // Visar bekräftelseprompten
      }
    }
  };

  const handleConfirmYes = async () => {
    try {
      const categoryId = formDataCategory?.id; // Tillgång till categoryId från formDataCategory
      const productId = formDataProduct?.id; // Tillgång till productId från formDataProduct

      if (categoryId && productId) { // Om categoryId och productId finns
        const response = await fetch(
          `https://app-productmanager-prod.azurewebsites.net/categories/${categoryId}/products/${productId}`, // Skickar categoryId och productId till API:et för att lägga till produkt till kategori
          {
            method: "POST", // Metod för att lägga till produkt till kategori
            headers: {
              "Content-Type": "application/json", // Sätter Content-Type till application/json
              Authorization: `Bearer ${token}`, // Sätter Authorization till token
            },
          }
        );

        if (response.status === 201 || response.status === 204) { // Om status är 201 eller 204
          setSearchResult([]); // Rensar sökresultatet
          reset(); // Rensar formuläret
          setIsProductSavedToCategoryMessage(true); // Visar meddelandet om att produkten har lagts till i kategorin
          setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
          setTimeout(() => {
            setIsProductSavedToCategoryMessage(false); // Gömmer meddelandet om att produkten har lagts till i kategorin
            navigate("/Main"); // Navigerar tillbaka till startsidan
          }, 2000); // Efter 2 sekunder
        } else if (response.status === 400) { // Om status är 400
          setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
          setErrorProductAlreadyExists("Produkten finns redan i den valda kategorin"); // Sätter felmeddelande till 'Produkten finns redan i den valda kategorin'
        }
      }
    } catch (error) { // Om det blir error
      setErrorUnauthorizedSecond("Ej behörighet för utförande"); // Sätter felmeddelande till 'Ej behörighet för utförande'
      console.error("Error:", error); // Logga error till konsolen
      setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
    }
  };

  const handleConfirmNo = () => {
    setIsConfirmationPromptVisible(false); // Gömmer bekräftelseprompten
    setIsSearchFormVisible(true); // Visar registreringsformuläret
    reset(); // Rensar formuläret
    setSearchResult([]); // Rensar sökresultatet
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
                rules={{ required: "Sku måste vara ifylld" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      type="text"
                      label={
                        <span style={{ fontSize: "14px" }}>Sök på SKU</span>
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
                <span>Sök</span>
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
                        Produkt
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
                      Namn
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Sku
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Beskrivning
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
                      Pris
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
                        {product.price} SEK
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
                        <span
                          style={{ fontWeight: "bold", fontSize: 16 }}
                        >
                          Kategorier
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
                        Namn
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: 100,
                        }}
                      >
                        Lägg till produkt
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
            <span>Är detta korrekt?</span>
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
                      <span>Namn</span>
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
                      <span>Beskrivning</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Bild (URL)</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: 100,
                      }}
                    >
                      <span>Pris</span>
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
                        {formDataProduct.price} SEK
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
            <span>Produkt tillagd till kategori</span>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddProductToCategory;
