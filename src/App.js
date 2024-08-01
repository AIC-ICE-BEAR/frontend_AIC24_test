import Sidebar from './components/Sidebar';
import DisplayResult from './components/ResultDisplay';
import { SearchResultProvider } from './contexts/ClipsearchContext';
import { OCRresultProvider } from './contexts/OCRsearchContext';
import { ASRResultProvider } from './contexts/ASRsearchContext';
import { ModeContextProvider } from './contexts/searchModeContext';
import axios from 'axios';
import './App.css';


function App() {
  return (
    <ASRResultProvider>
    <OCRresultProvider>
    <ModeContextProvider>
      <SearchResultProvider>
        <div className="text-center h-full flex flex-col">
          <header className="bg-gray-800 p-5 text-white text-3xl max-h-20 max-w-full">
            <h1>Event Retrieval App</h1>
          </header>
          <main className="flex flex- justify-center items-start p-5 overflow-auto">
            <Sidebar />
            <DisplayResult className="flex-3 p-1 h-full overflow-auto" />
          </main>
          <footer className="mt-auto pt-20">
            © 2024 Retrieval App Inc. All rights reserved.
          </footer>
        </div>
      </SearchResultProvider>
    </ModeContextProvider>
    </OCRresultProvider>
    </ASRResultProvider>
  );
}

export default App;
