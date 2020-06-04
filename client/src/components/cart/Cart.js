import React, { useContext } from "react";
import { Drawer, Typography, Grid, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { UserContext } from "../../Contexts/UserContext";
import CloseIcon from "@material-ui/icons/Close";
import ProductCard from "../ProductCard/ProductCard";
import DeleteIcon from "@material-ui/icons/Delete";

// STYLES
import useStyles from "./CartStyles";

const Cart = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    setUser,
    authenticateUser,
    openCart,
    isCartOpen,
    cartList,
    clearCartAndLocalStorage,
    totalCost,
  } = useContext(UserContext);
  const { createSlug } = props;
  function redirectToCheckOut() {
    if(cartList !== undefined){   
      if(cartList !== null) {
 
    const checkLoginSession = () => {
      fetch("http://localhost:8080/sessions/checkLoginSession", {
        method: "GET",
        credentials: "include"
      }).then(async (response) => {
        if (response.status === 200) {
          const dataFromBackend = await response.json();
          setUser(dataFromBackend);
          authenticateUser(dataFromBackend);
          history.push("/checkout");
        }
        if (response.status === 403) {
          let messageResponse = await response.json();
          console.log(JSON.stringify(messageResponse))
          alert(JSON.stringify(messageResponse.err.login + "checkout"));
        }
      })
    }
      }
    } 
  }
  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      <Drawer
        style={{
          overflowX: "hidden",
        }}
        anchor="right"
        open={isCartOpen}
      >
        <div className={classes.headerWrapper}>
          <CloseIcon className={classes.closeIcon} onClick={openCart} />
          <Typography className={classes.header} variant="h4">
            Cart
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={clearCartAndLocalStorage}
          >
            <DeleteIcon fontSize="small" />
            Cart
          </Button>
        </div>
        <div className={classes.listWrapper}>
          <Grid item>
            {cartList !== null &&
              cartList !== undefined &&
              renderProducts(cartList, createSlug)}
          </Grid>
          <Grid item>
            <Typography className={classes.totalCostText}>
              Total cost excluding shipment: {totalCost()} SEK
            </Typography>
            <Typography className={classes.totalCostText}>
              VAT: {totalCost() * 0.2} SEK
            </Typography>
          </Grid>
        </div>
        <Button
          className={classes.submitButton}
          variant="contained"
          color="primary"
          onClick={() => redirectToCheckOut()}
        >
          To payment
        </Button>
      </Drawer>
    </div>
  );
};

const renderProducts = (cartList, createSlug) => {
  return cartList.map((product) => {
    const slug = createSlug(product.name);
    return (
      <ProductCard
        case="cart"
        key={product._id}
        product={product}
        path={`/product/${slug}`}
      />
    );
  });
};

export default Cart;
