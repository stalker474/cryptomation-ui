import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import {DelayInput} from 'react-delay-input';
import Slider from '@material-ui/core/Slider';

const axios = require('axios');
const { ethers } = require("ethers");

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (boolean)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

export default function TokensControl(props) {
  const classes = useStyles();

  const [decimals, setDecimals] = React.useState(0);
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [toBuy, setToBuy] = React.useState(0);
  const [slippage, setSlippage] = React.useState(0);
  const [invest, setInvest] = React.useState(0);
  const [error, setError] = React.useState("");

  const handleAddressChange = (event) => {
    if(ethers.utils.isAddress(event.target.value)) {
      setAddress(event.target.value);
      let provider = new ethers.providers.WebSocketProvider(props.data.CONF.local);
      const erc20 = new ethers.Contract(event.target.value, abi, provider);
      erc20.decimals().then(d => {
        setDecimals(d)
      }).catch(err => {
        setName("ERC20 not found")
      })
      erc20.symbol().then(n => {
        setName(n);
      }).catch(err => {
        setName("ERC20 not found")
      })
    }
  };

  const handleToBuyChange = (event) => {
    setToBuy(event.target.value)
  }

  const handleSlippageChange = (event, newValue) => {
    setSlippage(newValue)
  }

  const handleInvestChange = (event) => {
    setInvest(event.target.value)
  }

  const addToken = (event) => {
    axios
      .post('http://localhost:3001/add', {
        address: address,
        toBuy: toBuy,
        slippage: slippage,
        invest: invest,
        decimals: decimals,
        name: name
      })
  }

  const removeToken = (address) => {
    axios
      .post('http://localhost:3001/remove', {
        address: address
      })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell align="right">Tokens to buy</TableCell>
                <TableCell align="right">Slippage</TableCell>
                <TableCell align="right">ETH to use</TableCell>
                <TableCell align="right">Decimals</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.CONF.tokens.map((token) => (
                <TableRow key={token.address}>
                  <TableCell component="th" scope="row">
                    {token.address}
                  </TableCell>
                  <TableCell align="right">{token.to_buy}</TableCell>
                  <TableCell align="right">{token.slippage}</TableCell>
                  <TableCell align="right">{token.eth_to_spend}</TableCell>
                  <TableCell align="right">{token.decimals}</TableCell>
                  <TableCell align="right">{token.name}</TableCell>
                  <TableCell align="right"><Button onClick={() => {removeToken(token.address)}}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item item xs={12}>
        <Grid container>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Address</FormLabel><DelayInput style={{width : "50ch"}} label="" delayTimeout={300} value={address} onChange={handleAddressChange} />
         </Grid>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>To buy</FormLabel><DelayInput style={{width : "10ch"}} label="" delayTimeout={300} value={toBuy} onChange={handleToBuyChange} />
         </Grid>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Slippage</FormLabel><Slider style={{width: "50ch"}} min={0} max={2000} value={slippage} onChange={handleSlippageChange} aria-labelledby="continuous-slider" />{slippage}%
         </Grid>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Invest</FormLabel><DelayInput style={{width : "10ch"}} label="" delayTimeout={300} value={invest} onChange={handleInvestChange} />
         </Grid>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Digits</FormLabel>{decimals}
         </Grid>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Name</FormLabel>{name}
         </Grid>
         <Grid container container item xs={12}>
         <Button onClick={addToken}>Add</Button>
         </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}