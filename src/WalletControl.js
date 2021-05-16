import React from 'react';
import {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {DelayInput} from 'react-delay-input';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
const axios = require('axios');
const { ethers } = require("ethers");

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100ch',
      },
    },
  }));

export default function WalletControl(props) {
    const classes = useStyles();
    const [privateKey, setPrivateKey] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [publicKey, setPublicKey] = React.useState("");
    const [balance, setBalance] = React.useState("");
  
    const handlePrivateKeyChange = (event) => {
      axios
      .post('/change', {
        pk: event.target.value.toString()
      })
    };

    const handleDestinationChange = (event) => {
      axios
      .post('/change', {
        dest_address: event.target.value.toString()
      })
    };

    useEffect(() => {
      let wallet = new ethers.Wallet(privateKey);
      setPublicKey(wallet.address);
      if(props.data.CONF) {
        let provider = new ethers.providers.WebSocketProvider(props.data.CONF.local);
        provider.getBalance(wallet.address).then(b => {
          setBalance(ethers.utils.formatEther(b));
        })
      }
    }, []);

    if(props.data && props.data.CONF) {
      if(props.data.CONF.pk != privateKey) setPrivateKey(props.data.CONF.pk);
      if(props.data.CONF.dest_address != destination) setDestination(props.data.CONF.dest_address);
    }
    
    return (
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Private key:</FormLabel><DelayInput style={{width : "100ch"}} label="" delayTimeout={300} value={privateKey} onChange={handlePrivateKeyChange} />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Public key: {publicKey}</FormLabel>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Balance: {balance}</FormLabel>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Destination:</FormLabel><DelayInput style={{width : "100ch"}} label="" delayTimeout={300} value={destination} onChange={handleDestinationChange} />
          </Grid>
        </Grid>
      </Grid>
    );
  }