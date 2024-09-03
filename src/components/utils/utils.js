import Papa from 'papaparse';

export const mapKeyframe = async (videoName, keyFrameId) => {
  return new Promise((resolve, reject) => {
    const PATH_TO_FILE_MAP = process.env.REACT_APP_MAP_KEYFRAME;

    const filePath = `${PATH_TO_FILE_MAP}/${videoName}.csv`;

    // Fetch the CSV file from the public folder
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Get the file content as text
      })
      .then((fileContent) => {
        // Parse the CSV file content
        Papa.parse(fileContent, {
          header: true, // Assuming the CSV file has headers
          complete: (result) => {
            const data = result.data;

            const keyFrameIndex = keyFrameId - 1; // Convert to zero-indexed

            if (keyFrameIndex >= 0 && keyFrameIndex < data.length) {
              const frameIdx = data[keyFrameIndex]['frame_idx']; // Adjust if column name is different
              const videoSpeed = data[keyFrameIndex]['fps']
              resolve({ videoName, frameIdx, videoSpeed });
            } else {
              reject('Invalid keyFrameId');
            }
          },
          error: (error) => {
            reject('Error parsing the CSV: ' + error.message);
          },
        });
      })
      .catch((error) => {
        reject('Error fetching the file: ' + error.message);
      });
  });
};
