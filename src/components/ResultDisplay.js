import React, { useState } from 'react';
import axios from 'axios';

function DisplayResult({ style }) {
  const [results, setResults] = useState([
    {
      video_name: "L23_V030",
      keyframe_id: 213,
      score: 1.5590629577636719,
    },
    {
      video_name: "L26_V002",
      keyframe_id: 83,
      score: 1.5802946090698242,
    },
    {
      video_name: "L12_V018",
      keyframe_id: 53,
      score: 1.5818766355514526,
    },
    {
      video_name: "L05_V018",
      keyframe_id: 202,
      score: 1.5830798149108887,
    },
    {
      video_name: "L33_V022",
      keyframe_id: 134,
      score: 1.586905598640442,
    },
    {
      video_name: "L32_V028",
      keyframe_id: 104,
      score: 1.58737313747406,
    },
    {
      video_name: "L16_V031",
      keyframe_id: 169,
      score: 1.588735818862915,
    },
    {
      video_name: "L21_V006",
      keyframe_id: 181,
      score: 1.5955194234848022,
    },
    {
      video_name: "L23_V030",
      keyframe_id: 210,
      score: 1.5958590507507324,
    },
    {
      video_name: "L26_V001",
      keyframe_id: 209,
      score: 1.5974398851394653,
    },
    {
      video_name: "L26_V001",
      keyframe_id: 203,
      score: 1.5985877513885498,
    },
    {
      video_name: "L06_V008",
      keyframe_id: 114,
      score: 1.6008328199386597,
    },
    {
      video_name: "L06_V011",
      keyframe_id: 83,
      score: 1.601688265800476,
    },
    {
      video_name: "L16_V031",
      keyframe_id: 170,
      score: 1.6036049127578735,
    },
  ]);

  const extract_name_img = (vid_name, kf_id) => {
    const videoNumber = parseInt(vid_name.slice(1, 3));
    let formattedNumber;
    if (videoNumber >= 17) {
      formattedNumber = kf_id.toString().padStart(3, '0');
    } else {
      formattedNumber = kf_id.toString().padStart(4, '0');
    }
    return `${formattedNumber}.jpg`;
  };

  return (
    <div className="block" style={style}>
      <div>
        <label>Result</label>
        {results && (
          <div className="grid grid-cols-5 gap-2">
            {results.map((item, index) => (
              <div key={index} className="border border-gray-300 p-1 bg-white">
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/Keyframes_${item.video_name.slice(
                    0,
                    3
                  )}/${item.video_name}/${extract_name_img(
                    item.video_name,
                    item.keyframe_id
                  )}`}
                  className="w-full h-auto"
                  alt={item.keyframe_id}
                />
                {item.video_name} {extract_name_img(item.video_name, item.keyframe_id)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayResult;
