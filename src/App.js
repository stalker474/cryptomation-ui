import './App.css';
import React from 'react';
import {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SimpleTabs from './MainTab';
import StatusControl from './StatusControl';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 400,
  },
  control: {
    padding: 2,
  },
}));

function App() {
  const [data, setData] = React.useState({running : false});

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/status")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
     <SimpleTabs data={data}/>
     <StatusControl data={data}/>
    </div>
  );
}

export default App;
