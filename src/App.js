import Sidebar from './components/Sidebar';
import DisplayResult from './components/ResultDisplay';
import PasswordCheck from './components/SecurityCheck'
import { SearchResultProvider } from './contexts/ClipsearchContext';
import { OCRresultProvider } from './contexts/OCRsearchContext';
import { ASRResultProvider } from './contexts/ASRsearchContext';
import { OBDetResultProvider } from './contexts/OBDetsearchContext'
import { ModeContextProvider } from './contexts/searchModeContext';
import { ClipConfigProvider } from './contexts/ClipSearchConfigContext'
import { TemporalResultProvider } from './contexts/TemporalSearchContext'
import { SubmitProvider } from './contexts/SubmitImageContext';
import { VQAImageProvider } from './contexts/VQAImageContext'
import { VQAResultProvider } from './contexts/VQAContext'
import { FeedbackImageProvider } from './contexts/ImagesFeedBack'
import { CSVPreviewProvider } from './contexts/CSVPreviewContext'
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  return (
    <CSVPreviewProvider>
      <FeedbackImageProvider>
        <VQAResultProvider>
          <VQAImageProvider>
            <TemporalResultProvider>
              <SubmitProvider>
                <ClipConfigProvider>
                  <OBDetResultProvider>
                    <ASRResultProvider>
                      <OCRresultProvider>
                        <ModeContextProvider>
                          <SearchResultProvider>
                            <div>
                              {accessGranted ? (
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
                              ) : (
                                <PasswordCheck onAccessGranted={() => setAccessGranted(true)} />
                              )}
                            </div>


                          </SearchResultProvider>
                        </ModeContextProvider>
                      </OCRresultProvider>
                    </ASRResultProvider>
                  </OBDetResultProvider>
                </ClipConfigProvider>
              </SubmitProvider>
            </TemporalResultProvider>
          </VQAImageProvider>
        </VQAResultProvider>
      </FeedbackImageProvider>
    </CSVPreviewProvider>
  );
}

export default App;
