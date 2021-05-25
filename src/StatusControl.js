import React from 'react';
import {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
const { ethers } = require("ethers");

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

export default function StatusControl(props) {
  const classes = useStyles();

  const startBot = (event) => {
    fetch("http://localhost:3001/start")
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    });
  }

  const stopBot = (event) => {
    fetch("http://localhost:3001/stop")
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    });
  }

  // useEffect(() => {
  //   if(props && props.data && props.data.CONF) {
  //     let provider = new ethers.providers.WebSocketProvider(props.data.CONF.local);
  //     props.data.CONF.transactions.forEach(tx => {
  //       provider.getTransactionReceipt(tx.hash).then(receipt => {
  //         if(receipt.status == 1) {
  //           tx.status = "mined";
  //         } else {
  //           tx.status = receipt.confirmations > 0? "reverted" : "pending";
  //         }
  //       })
  //     })
  //   }
  // }, []);

  const data = props.data;

  return (
    <Grid container>
      <Grid item item xs={12} style={{backgroundColor : data.running? 'green' : 'red'}}>
        {data.running?<Button onClick={stopBot}>Stop</Button>:
          <Button onClick={startBot}>Start</Button>
          }
      </Grid>
      <Grid item item xs={12}>
      <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.CONF && props.data.CONF.transactions.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell component="th" scope="row">
                    {tx.hash}
                  </TableCell>
                  <TableCell align="right">{tx.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}