import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Card, CardHeader, CardActions, CardActionArea } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import useStyles from './ProductCardStyles/MainCardStyles';

const ProductCard = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const { product, path } = props;

    const handleClick = () => {
        return history.push(path)
    }

    return (
        <Grid item>
            <Card>
                <CardActionArea>
                    <CardHeader title={product.name} titleTypographyProps={{ variant: 'h6' }} classes={{ title: classes.title }} />
                    <Typography>
                        {product.name}
                    </Typography>
                    <Typography>{product.description}</Typography>
                    <Typography>
                        {product.price}SEK
                    </Typography>
                </CardActionArea>
                <CardActions>
                    {window.location.pathname === path ? <Button size="small" onClick={handleClick}>Add to cart</Button> :
                    props.case === 'main' ? <Button size="small" onClick={handleClick}>View product</Button> : null}
                </CardActions>
            </Card>
        </Grid>
    )
}



export default ProductCard;