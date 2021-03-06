import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, Paper, Button } from "@material-ui/core";
import useStyles from "./OrdersStyles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { UserContext } from "../../Contexts/UserContext";

const Orders = () => {
  const classes = useStyles();

  const { setAlert } = useContext(UserContext);

  const [orders, setOrders] = useState();
  const [shipped, setShipped] = React.useState("false");

  const getAllOrders = async () => {
    const allOrders = await fetch("http://localhost:8080/api/orders", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    return allOrders;
  };

  const updateOrder = (event) => {
    event.preventDefault();
    const order = {
      _id:
        event.target.parentElement.parentElement.parentElement.parentElement
          .dataset.id,
      shipped: shipped,
    };

    fetch("http://localhost:8080/api/orders/" + order._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then(() => {
        setAlert({
          showAlert: true,
          type: "success",
          message: "Order updated.",
        });
      });
  };

  const handleChange = (event) => {
    setShipped(event.target.value);
  };

  const setupOrders = async () => {
    const allOrders = await getAllOrders();
    setOrders(allOrders);
  };

  useEffect(() => {
    setupOrders();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {orders !== undefined
        ? orders.map((order) => (
            <Grid
              container
              key={order._id}
              data-id={order._id}
              className={classes.orderContainer}
            >
              <Paper className={classes.paper} style={{ width: " 100%" }}>
                <Grid item xs={12} className={classes.information}>
                  <Typography className={classes.heading} variant="h6">
                    Order: {order._id}{" "}
                  </Typography>
                  <Typography className={classes.heading} variant="h6">
                    Order Date: {order.orderDate.split("T")[0]}{" "}
                  </Typography>
                </Grid>
                <Grid container className={classes.orderItems}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Information: </Typography>
                    <Typography>Name: {order.name}</Typography>
                    <Typography>Lastname: {order.lastname}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Grid container className={classes.products}>
                      <Grid item xs={12}>
                        <Typography variant="h6">Products:</Typography>
                      </Grid>
                      {order.products[0] !== undefined &&  
                        order.products[0].map((product) => (
                        <Grid
                          item
                          xs={12}
                          className={classes.orderPaper}
                          key={product._id}
                        >
                          <Typography className={classes.title}>
                            {product.cartAmount} {product.name}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.delivery}>
                    <Typography variant="h6"> Delivery:</Typography>
                    <Typography>
                      Alternative: {order.shipment.alternative}
                    </Typography>
                    <Typography>Cost: {order.shipment.cost} SEK</Typography>
                    <Typography>
                      Days to delivery: {order.shipment.deliveryTime}
                    </Typography>
                    <Typography>
                      Shipped:{" "}
                      {order.shipped === false ? "Not shipped" : "Shipped"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.priceAndShipped}>
                  <Grid item xs={12} sm={6} className={classes.total}>
                    <Typography>Total cost: {order.totalPrice} SEK </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <form onSubmit={updateOrder}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          defaultValue={order.shipped.toString()}
                          aria-label="shipped"
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Shipped"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="Not shipped"
                          />
                          <Button
                            type="submit"
                            style={{ marginLeft: "1rem" }}
                            size="small"
                            className={classes.submitButton}
                            variant="contained"
                            color="primary"
                          >
                            Update
                          </Button>
                        </RadioGroup>
                      </FormControl>
                    </form>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))
        : null}
    </>
  );
};

export default Orders;
