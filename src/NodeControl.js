import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {DelayInput} from 'react-delay-input';
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
  
    const handleNodeUrlChange = (event) => {
      axios
      .post('/change', {
        local: event.target.value.toString()
      })
    };

    if(props.data && props.data.CONF) {
      if(props.data.CONF.local != nodeUrl) setNodeUrl(props.data.CONF.local);
    }

    return (
      <div className={classes.root}>
        <DelayInput label="" delayTimeout={300} value={nodeUrl} onChange={handleNodeUrlChange} />
      </div>
    );
  }