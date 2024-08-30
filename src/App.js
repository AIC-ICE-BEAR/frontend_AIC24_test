import Sidebar from './components/Sidebar';
import DisplayResult from './components/ResultDisplay';
import { SearchResultProvider } from './contexts/ClipsearchContext';
import { OCRresultProvider } from './contexts/OCRsearchContext';
import { ASRResultProvider } from './contexts/ASRsearchContext';
import { OBDetResultProvider } from './contexts/OBDetsearchContext'
import { ModeContextProvider } from './contexts/searchModeContext';
import { ClipConfigProvider } from './contexts/ClipSearchConfigContext'
import { SubmitProvider } from './contexts/SubmitImageContext';
import { ToastContainer } from 'react-toastify';

import './App.css';

function App() {
  return (
    <SubmitProvider>
      <ClipConfigProvider>
        <OBDetResultProvider>
          <ASRResultProvider>
            <OCRresultProvider>
              <ModeContextProvider>
                <SearchResultProvider>
                  <div className="text-center h-full flex flex-col">
                    <ToastContainer />
                    <header className="bg-gray-800 p-5 text-white text-3xl max-h-20 max-w-full">
                      <h1>Event Retrieval App</h1>
                    </header>
                    <main className="flex justify-center items-start p-5 overflow-auto h-full">
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
        </OBDetResultProvider>
      </ClipConfigProvider>
    </SubmitProvider>
  );
}

export default App;
