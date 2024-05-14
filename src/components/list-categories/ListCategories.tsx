import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { CategoryProps } from "../add-category/AddCategory.types";
import { ProductProps } from "../add-product-to-category/AddProductToCategory.types";

const ListCategories = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const token = localStorage.getItem("token");
  const [errorUnauthorized, setErrorUnauthorized] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://app-productmanager.azurewebsites.net/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: CategoryProps[] = await response.json();
        const categoriesWithProducts = data.filter(
          (category: CategoryProps) => category.products.length > 0
        );
        setCategories(categoriesWithProducts);
      } catch (error) {
        setErrorUnauthorized("Not authorized to perform this operation");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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
      {categories.map((category: CategoryProps) => (
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
                {category.products.map((product: ProductProps, index: number) => (
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
                      {product.price} $
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
