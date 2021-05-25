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

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '80ch',
      },
    },
  }));

export default function NodeControl(props) {
    const classes = useStyles();
    const [nodeUrl, setNodeUrl] = React.useState("wss://rinkeby.infura.io/ws/v3/<INFURA_API_KEY>");
    const [wssUrl, setWssUrl] = React.useState("wss://");
  
    const handleMainNodeUrlChange = (event) => {
      axios
      .post('http://localhost:3001/change', {
        local: event.target.value.toString()
      })
    };

    const handleNodeUrlChange = (event) => {
      setWssUrl(event.target.value);
    };

    const addNode = (event) => {
      axios
        .post('http://localhost:3001/addNode', {
          url: wssUrl,
        })
    }
  
    const removeNode = (url) => {
      axios
        .post('http://localhost:3001/removeNode', {
          url: url
        })
    }

    if(props.data && props.data.CONF) {
      if(props.data.CONF.local != nodeUrl) setNodeUrl(props.data.CONF.local);
    }

    return (
      <div className={classes.root}>
        <DelayInput label="" delayTimeout={300} value={nodeUrl} onChange={handleMainNodeUrlChange} />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Websocket Url</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.CONF.nodes.map((nodeWsUrl) => (
                <TableRow key={nodeWsUrl}>
                  <TableCell component="th" scope="row">
                    {nodeWsUrl}
                  </TableCell>
                  <TableCell align="right"><Button onClick={() => {removeNode(nodeWsUrl)}}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container>
         <Grid container container item xs={12}>
                <FormLabel style={{width: "10ch"}}>Url</FormLabel><DelayInput style={{width : "50ch"}} label="" delayTimeout={300} value={wssUrl} onChange={handleNodeUrlChange} />
         </Grid>
         <Grid container container item xs={12}>
         <Button onClick={addNode}>Add</Button>
         </Grid>
        </Grid>
      </div>
    );
  }