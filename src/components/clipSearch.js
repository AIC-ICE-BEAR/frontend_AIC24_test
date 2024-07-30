import React, { useEffect } from 'react';
import { useSearchResult } from '../contexts/ClipsearchContext';

const ClipSearch = () => {
  const { searchResult, setSearchResult } = useSearchResult();

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        { video_name: 'L01_V002', keyframe_id: 50, score: 67 },
        { video_name: 'L02_V001', keyframe_id: 8, score: 67 },
        { video_name: 'L02_V001', keyframe_id: 7, score: 62 },
        { video_name: 'L02_V002', keyframe_id: 25, score: 60 }
      ];
      setSearchResult(data);
    };

    fetchData();
  }, [setSearchResult]);

  return (
    <div>
      <h1>Search Results</h1>
      <ul>
        {searchResult.map((result, index) => (
          <li key={index}>
            {result.video_name} - Keyframe ID: {result.keyframe_id} - Score: {result.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClipSearch;