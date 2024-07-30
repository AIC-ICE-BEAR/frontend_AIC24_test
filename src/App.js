import Sidebar from './components/Sidebar';
import axios from 'axios';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
                <h1>
                    Event retrival App
                </h1>
      </header>
      <main>
                <Sidebar />
      </main>
      <footer>
                <p>
                    © 2024 Retrival App Inc.
                    All rights reserved.
                </p>
      </footer>
    </div>
  );
}

export default App;
