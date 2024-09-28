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
            const keyFrameIndex = keyFrameId; // Convert to zero-indexed
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


export const getImageListFromCSV = async (videoName) => {
  return new Promise((resolve, reject) => {
    const PATH_TO_FILE_MAP = process.env.REACT_APP_MAP_KEYFRAME;
    const filePath = `${PATH_TO_FILE_MAP}/${videoName}.csv`;

    // Fetch the CSV file
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

            // Map through the parsed data to create an array of images
            const imageList = data.map((item, index) => ({
              frameIdx: item['frame_idx'], // Adjust if the column name is different
              imageUrl: `${process.env.REACT_APP_IMAGE_PATH}/${videoName}/${item['id']}.jpg`,
              time: item['pts_time'],
              fps: item['fps'],
            }));

            resolve(imageList);
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



export const findImageFromFrameIdx = async (videoName, frameIdx) => {
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

            // Find the row that has the closest frame_idx to the input frameIdx
            let closestRow = null;
            let smallestDifference = Infinity;

            data.forEach((item) => {
              const currentFrameIdx = Number(item['frame_idx']);
              const difference = Math.abs(currentFrameIdx - Number(frameIdx));
              if (difference < smallestDifference) {
                smallestDifference = difference;
                closestRow = item;

              }
            });

            if (closestRow) {
              const imageId = closestRow.id; // Get the image id from the closest row
              resolve({ videoName, imageId });
            } else {
              console.log("FrameIdx not found");
              // reject(new Error('No matching frame index found.'));
            }
          },
          error: (error) => {
            console.log('Error parsing the CSV: ' + error.message);
            // reject(error);
          },
        });
      })
      .catch((error) => {
        console.log('Error fetching the file: ' + error.message);
        // reject(error);
      });
  });
};





export const createCSV = async (data, submittedImages) => {
  // Array to hold formatted data

  const formattedData = []
  for (const items of submittedImages) {
    formattedData.push(items.text)
  }
  // Loop through each item in the data array
  for (const item of data) {
    try {
      // Wait for mapKeyframe to resolve and get the frameIdx
      const result = await mapKeyframe(item.video_name, item.keyframe_id);

      const frameIdx = result.frameIdx;

      // Format the data and push to the formattedData array
      formattedData.push(`${item.video_name.split('/').pop()}, ${frameIdx}`);
    } catch (error) {
      console.error('Error mapping keyframe:', error);
    }
  }

  // Join all formatted lines into a single string with newline separators
  const csvContent = formattedData.join('\n');

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a download link and trigger a click event
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'output.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



export const createCSV_VQA = async (data, submittedImages, answer) => {
  // Array to hold formatted data
  console.log(data)
  const formattedData = []
  for (const items of submittedImages) {
    formattedData.push(items.text)
  }
  // Loop through each item in the data array
  for (const item of data) {
    try {
      // Wait for mapKeyframe to resolve and get the frameIdx
      const result = await mapKeyframe(item.video_name, item.keyframe_id);

      const frameIdx = result.frameIdx;

      // Format the data and push to the formattedData array
      formattedData.push(`${item.video_name.split('/').pop()}, ${frameIdx},${answer}`);
    } catch (error) {
      console.error('Error mapping keyframe:', error);
    }
  }

  // Join all formatted lines into a single string with newline separators
  const csvContent = formattedData.join('\n');

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a download link and trigger a click event
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'output.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

