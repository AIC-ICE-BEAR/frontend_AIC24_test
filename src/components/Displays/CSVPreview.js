import React, { useState } from 'react';
import { createCSV_VQA } from '../utils/utils'
import { useCSVPreview } from '../../contexts/CSVPreviewContext'

function CSVPreview({
    searchMode,
    displayResult,
    handleSubmissionRefresh,
    createCSV
}) {
    const [Answer, setAnswer] = useState('');
    const { submittedImages } = useCSVPreview()
    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="flex">
                    <div className="flex flex-col justify-start overflow-y-auto max-h-20">

                        <label >Submissione preview</label>

                        {submittedImages.length > 0 ? (
                            submittedImages.map((item, index) => (
                                <tr key={index}>
                                    {/* Replace 'image.field1', 'image.field2' with actual fields from submittedImages */}
                                    <td className="border border-gray-400 px-4 py-2">{item.text}</td>
                                    <td className="border border-gray-400 px-4 py-2">{item.image}.jpg</td>

                                </tr>
                            ))) :
                            <tr>
                                <td className="border border-gray-400 px-4 py-2" colSpan="3">No data available</td>
                            </tr>
                        }


                    </div>

                    <div>
                        <img
                            className="w-8 p-0.5 rounded-md border-gray-300 border-4 hover:border-black cursor-pointer"
                            src={'./refresh.png'}
                            alt="Refresh"
                            onClick={handleSubmissionRefresh} // Call handleRefresh when clicked
                        />
                    </div>
                </div>

                <label className='justify-center'>Result</label>
                {searchMode === "vqa" ?
                    (<div className="flex justify-end">
                        <form>
                            <input
                                type="text"
                                placeholder="Enter the answer"
                                value={Answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-60 mb-4 p-2 border border-black rounded"
                            />
                        </form>
                        <button className="p-4 py-1 bg-gray-300 text-black border-black border-2 rounded"
                            onClick={() => {
                                if (displayResult.length === 0) {
                                    console.log("displayResult not found")
                                }
                                else {
                                    if (Answer === '') {
                                        createCSV_VQA(displayResult, submittedImages, '0')
                                    }
                                    else {
                                        createCSV_VQA(displayResult, submittedImages, Answer)
                                    }

                                }
                            }}>
                            Create CSV
                        </button>
                    </div>) :
                    (<div className="flex justify-end">
                        <button className="p-4 py-1 bg-gray-300 text-black border-black border-2 rounded"
                            onClick={() => {
                                if (displayResult.length === 0) {
                                    console.log("displayResult not found")
                                }
                                else {
                                    if (searchMode === "asr") {
                                        const resultFormat = []
                                        for (const item of displayResult) {
                                            for (const frame of item.keyframe_id)
                                                resultFormat.push({
                                                    video_name: item.video_name,
                                                    keyframe_id: frame
                                                })
                                        }
                                        createCSV(resultFormat, submittedImages)
                                    }
                                    if (searchMode === "temporal") {

                                        const resultFormat = []
                                        for (const item of displayResult) {
                                            for (const frame of item.matched_frames)
                                                resultFormat.push({
                                                    video_name: item.video_name,
                                                    keyframe_id: frame
                                                })
                                        }
                                        createCSV(resultFormat, submittedImages)
                                    }

                                    if (searchMode === "text") {
                                        createCSV(displayResult, submittedImages)
                                    }
                                    else {
                                        console.log(
                                            "Not the correct search mode"
                                        )
                                    }
                                }
                            }}>
                            Create CSV
                        </button>
                    </div>)
                }

            </div>

        </div>
    );
}

export default CSVPreview;
