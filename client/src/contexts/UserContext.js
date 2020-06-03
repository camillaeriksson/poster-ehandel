import React, { createContext, useState } from "react";
export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userData, setUserData] = useState("");
  const [isAuthenticated, setAuthentication] = useState(false);
  // CartStates
  const [cartList, setCartList] = useState(
    JSON.parse(localStorage.getItem("products" || []))
  );

  const addToCartAndLocalStorage = (newProduct) => {
    if (!cartList) {
      newProduct.cartAmount++;
      setCartList([newProduct]);
      localStorage.setItem("products", JSON.stringify([newProduct]));
    }
    if (JSON.parse(localStorage.getItem("products")) === null) {
      localStorage.setItem("products", JSON.stringify(cartList));
    }
    let existingProduct;

    if (cartList) {
      cartList.forEach((product) => {
        if (newProduct.name === product.name) {
          existingProduct = product;
        }
      });
      if (existingProduct) {
        existingProduct.cartAmount++;
        const state = [...cartList];
        const productIndex = state.findIndex(
          (p) => p.name === existingProduct.name
        );
        const lsList = JSON.parse(localStorage.getItem("products"));
        const lsProductIndex = lsList.findIndex(
          (p) => p.name === existingProduct.name
        );
        state.splice(productIndex, 1, existingProduct);
        lsList.splice(lsProductIndex, 1, existingProduct);
        setCartList(state);
        localStorage.setItem("products", JSON.stringify(lsList));
      }

      if (!existingProduct) {
        const state = [...cartList];
        newProduct.cartAmount++;
        state.push(newProduct);
        setCartList(state);
        localStorage.setItem("products", JSON.stringify(state));
      }
    }
  };

  const updateCounter = (product, anchor) => {
    if (anchor === "add") {
      product.cartAmount++;
    }
    if (anchor === "remove") {
      product.cartAmount--;
    }
    const state = [...cartList];
    const productIndex = state.findIndex((p) => p.name === product.name);

    if (product.cartAmount < 1) {
      state.splice(productIndex, 1);
    } else {
      state.splice(productIndex, 1, product);
    }

    setCartList(state);
    localStorage.setItem("products", JSON.stringify(state));
  };

  const clearCartAndLocalStorage = () => {
    setCartList();
    localStorage.removeItem("products");
  };

  const deleteProduct = (product) => {
    const state = [...cartList];
    const productIndex = state.findIndex((p) => p.name === product.name);
    state.splice(productIndex, 1);
    setCartList(state);
    localStorage.setItem("products", JSON.stringify(state));
  };

  //State för cartModal
  const openCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const authenticateUser = (user) => {
    if (user.role === "admin") {
      setAuthentication({
        isAuthenticated: true,
      });
    }
  };

  const setUser = (user) => {
    setUserData({
      email: user.email,
      role: user.role,
      deliveryAddress: user.deliveryAddress[0],
    });
  };

  // Logga in
  // Logga ut
  // Se senaste beställning

  function totalCost() {
    if (cartList !== null) {
      const totalCost = cartList.reduce((total, product) => {
        return total + product.cartAmount * product.price;
      }, 0);
      return totalCost;
    }
  }

  function amountOfItems() {
    if (cartList !== null) {
      const itemsAmount = cartList.reduce((amount, product) => {
        return amount + product.cartAmount;
      }, 0);
      return itemsAmount;
    }
  }

  return (
    <UserContext.Provider
      value={{
        isCartOpen,
        userData,
        cartList,
        isAuthenticated,
        openCart,
        setUser,
        addToCartAndLocalStorage,
        setCartList,
        authenticateUser,
        updateCounter,
        clearCartAndLocalStorage,
        deleteProduct,
        totalCost,
        amountOfItems,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
