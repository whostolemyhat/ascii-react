import React from 'react';
import './App.css';
import UploadForm from './UploadForm';
import NoWorkerConverter from './utils/noWorkerConverer';
import BackendForm from './components/BackendForm';

const noWorkerConverter = new NoWorkerConverter();

function App() {
  return (
    <div className="App">
      {/* //@ts-ignore */}
    {/* <UploadForm converter={noWorkerConverter}/> */}
    <BackendForm />
    </div>
  );
}

export default App;
