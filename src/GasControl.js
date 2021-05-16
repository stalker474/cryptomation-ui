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
        width: '25ch',
      },
    },
  }));

export default function GasControl(props) {
    const classes = useStyles();
    const [gasLimitValue, setGasLimit] = React.useState(0);
    const [gasDeltaValue, setGasDelta] = React.useState(1);
    const [gasPrice, setGasPrice] = React.useState({fast:0});

    useEffect(() => {
      const interval = setInterval(() => {
        fetch("https://ethgasstation.info/api/ethgasAPI.json?")
        .then((res) => res.json())
        .then((data) => {
          setGasPrice(data)
        });
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    const handleChangeGasLimit = (event) => {
      axios
      .post('/change', {
        limit: event.target.value.toString()
      })
    };

    const handleChangeGasDelta = (event) => {
      axios
      .post('/change', {
        gas_delta: event.target.value.toString()
      })
    };

    if(props.data && props.data.CONF) {
      if(props.data.CONF.gas_price != gasDeltaValue) setGasDelta(props.data.CONF.gas_price);
      if(props.data.CONF.gas != gasLimitValue) setGasLimit(props.data.CONF.gas);
    }

    const cost = ethers.utils.formatUnits(ethers.BigNumber.from(gasPrice.fast * gasLimitValue),"gwei");
  
    return (
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Maximum cost: {cost}</FormLabel>
          </Grid> 
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Gas limit:</FormLabel><DelayInput label="" delayTimeout={300} value={gasLimitValue} onChange={handleChangeGasLimit} />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Gas delta:</FormLabel><DelayInput label="" delayTimeout={300} value={gasDeltaValue} onChange={handleChangeGasDelta} />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item>
            <FormLabel>Gas price: {gasPrice.fast}</FormLabel>
          </Grid>
        </Grid>
      </Grid>
    );
  }