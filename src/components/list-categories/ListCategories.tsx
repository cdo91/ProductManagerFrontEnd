import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead,TableRow, Paper, IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
}

const ListCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Lägger in en tom array i useState som är av typen Category
  const token = localStorage.getItem("token"); // Hämtar token från localStorage och lägger in i variabeln token som sedan används i fetchen nedan för att kunna hämta data från API:et
  const [errorUnauthorized, setErrorUnauthorized] = useState(""); // Felmeddelande för att användaren inte är inloggad

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://app-productmanager-prod.azurewebsites.net/categories", { // Hämtar data från API:et
          headers: {
            Authorization: `Bearer ${token}`, // Lägger in token i header för att kunna hämta data från API:et
          },
        });

        const data: Category[] = await response.json(); // Sparar datan från API:et i variabeln data och sätter typen till Category
        const categoriesWithProducts = data.filter( // Filtrerar bort kategorier som inte har några produkter i sig
          (category: Category) => category.products.length > 0 // Sparar kategorier som har produkter i sig i variabeln categoriesWithProducts
        );
        setCategories(categoriesWithProducts); // Sätter state till categoriesWithProducts som innehåller kategorier med produkter i sig
      } catch (error) { // Om det blir error när datan ska hämtas från API:et så loggas det ut i konsolen
        setErrorUnauthorized("Ej behörighet för utförande");
        console.error("Error fetching data:", error); // Loggar ut error i konsolen
      }
    };
    fetchData(); // Kör funktionen fetchData
  }, []);

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
      {categories.map((category: Category) => (
        <div key={category.id}>
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
                <TableRow style={{ backgroundColor: "#004c9c" }}>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: "center", color: "#fff" }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>{category.name} ({category.products.length})</span>
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
                {category.products.map((product: Product, index: number) => (
                  <TableRow
                    key={product.id}
                    className={
                      index % 2 === 0 ? "table-row-even" : "table-row-odd"
                    }
                  >
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
        </div>
      ))}
      {errorUnauthorized && (
        <div style={{ textAlign: "center" }} className="error">
          {errorUnauthorized}
        </div>
      )}
    </div>
  );
};

export default ListCategories;
