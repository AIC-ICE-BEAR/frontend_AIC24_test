import React, { useRef, useEffect, useState } from "react";
import { BsSkipForward, BsSkipBackward } from "react-icons/bs"; // Import the icons
import { mapKeyframe, getImageListFromCSV } from '../utils/utils';
import { useCSVPreview } from '../../contexts/CSVPreviewContext'
import { FaLink } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa6";

const VideoPlayer = ({ videoUrl, frame_idx }) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [startTime, setStartTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null); // Hover time for preview
  const [previewImage, setPreviewImage] = useState(null); // Preview image
  const [imageFrames, setImageFrames] = useState([]);
  const [videoFPS, setvideoFPS] = useState(25);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const { submittedImages, setsubmittedImages } = useCSVPreview()


  const handleOpenImageInNewTab = (video_name) => {
    const videoUrl = `${process.env.REACT_APP_VIDEO_PATH}/${video_name}_480p.mp4`;
    window.open(videoUrl, '_blank');
  };

  useEffect(() => {
    if (videoUrl) {
      mapKeyframe(videoUrl, frame_idx)
        .then(result => {
          setStartTime(result.frameIdx / result.videoSpeed);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [videoUrl, frame_idx]);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      if (startTime && video) {
        video.currentTime = startTime;
        video.play().catch(error => {
          console.error("Autoplay was prevented:", error);
        });
      }
    };

    if (video) {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.load();
    }

    return () => {
      if (video) {
        video.pause();
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [startTime]);

  useEffect(() => {
    const fetchImageList = async () => {
      try {
        // Assuming you have a function to fetch image data and map it into imageList
        const imageList = await getImageListFromCSV(videoUrl);
        const updatedImageList = imageList.slice(0, -1);

        setImageFrames(updatedImageList);

      } catch (error) {
        console.error('Error fetching image list:', error);
      }
    };

    if (videoUrl) {
      fetchImageList();
    }
  }, [videoUrl]);

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  // Helper function to find the closest image based on the hover time
  const findClosestImage = (hoverTime) => {
    let closestImage = null;
    let closestTimeDifference = Infinity;

    imageFrames.forEach((frame) => {
      const timeDifference = Math.abs(hoverTime - frame.time);

      if (timeDifference < closestTimeDifference) {
        closestTimeDifference = timeDifference;
        closestImage = frame;
      }
    });

    return closestImage;
  };

  // Handle mouse movement on progress bar
  const handleMouseMove = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverPosX = e.clientX - rect.left;
    const percentage = hoverPosX / rect.width;
    const hoverTime = videoRef.current.duration * percentage;

    // Update hover time state
    setHoverTime(hoverTime);

    // Find the closest image based on hoverTime
    const closestImage = findClosestImage(hoverTime);
    setPreviewImage(closestImage); // Update the preview image to the closest available frame

    // Update mouse position state
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setPreviewImage(null);
  };

  // Handle clicking on the progress bar to seek to the clicked position
  const handleProgressBarClick = (e) => {
    try {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosX = e.clientX - rect.left;
      const percentage = clickPosX / rect.width;
      const clickedTime = videoRef.current.duration * percentage;

      // Seek the video to the clicked time
      videoRef.current.currentTime = clickedTime;
    }
    catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Get current time of the video
  const getCurrentTime = () => {
    const currentTime = videoRef.current.currentTime;
    const frame = Math.floor(currentTime * videoFPS)

    const closestImage = findClosestImage(currentTime);
    submittedImages.push({ text: `${videoUrl.split('/').pop()}, ${frame}`, image: closestImage.imageUrl.split('/').pop().slice(0, -4) })


  };

  return (
    <div className="relative w-fit">

      <video
        ref={videoRef}
        controls
        width="600"
        autoPlay
        muted
        controlsList="nodownload"  // Prevents download button
        style={{ '--moz-media-controls-timeline': 'none' }}
      >
        <source
          src={
            videoUrl.includes('_a')
              ? `${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}.mp4`
              : `${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}_480p.mp4`
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>


      <div className="absolute top-0 left-0 pointer-events-none flex justify-start items-center px-4">
        <button
          className="p-4 bg-transparent text-gray-300 rounded hover:text-gray-300 opacity-75 pointer-events-auto"
          onClick={() => {
            handleOpenImageInNewTab(videoUrl);
          }}
          alt="direct-link"
        >
          <FaLink size={30} />
        </button>
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex justify-between items-center px-4">
        <button
          className="p-4 bg-transparent text-gray-300 rounded hover:text-gray-300 opacity-75 pointer-events-auto"
          onClick={skipBackward}
        >
          <BsSkipBackward size={30} />
        </button>
        <button
          className="p-4 bg-transparent text-gray-300 rounded hover:text-gray-300 opacity-75 pointer-events-auto"
          onClick={skipForward}
        >
          <BsSkipForward size={30} />
        </button>
      </div>

      {/* Progress bar with hover preview */}
      <div
        className="relative w-full h-4 bg-gray-200 mt-2"
        ref={progressBarRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleProgressBarClick} // Add the click event handler here
        style={{ cursor: "pointer" }}
      >
        {/* Progress bar itself */}
        <div
          className="absolute left-0 top-0 h-full bg-red-500"
          style={{
            width: `${(videoRef.current && videoRef.current.duration > 0 ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0)}%`,
          }}
        />

        {/* Preview image */}
        {previewImage && hoverTime && (
          <div
            className="fixed bg-black text-white p-2"
            style={{
              left: `${mousePosition.x + 150}px`,
              top: `${mousePosition.y - 50}px`, // Adjust this to position the preview image slightly above the mouse cursor
              transform: "translateX(-50%)", // Center the preview image horizontally
              pointerEvents: "none" // Prevent the preview from interfering with mouse events
            }}
          >
            <img src={previewImage.imageUrl} alt="Preview" width="160" height="90" />
            <span>{Math.floor(hoverTime)}s</span>
          </div>
        )}
      </div>

      {/* Button to get current time */}
      <button
        className="mt-2 bg-blue-500 text-white p-2 rounded"
        onClick={getCurrentTime}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default VideoPlayer;


// Separate Modal Component for Video Player
export const VideoModal = ({ currentVideo, setCurrentVideo, setwatchVideoformVisible, frames }) => {
  return (
    <div className="h-1/2 w-full bg-opacity-50 flex items-center justify-center z-50">
      <div>
        <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setwatchVideoformVisible(false)}>
          Close
        </button>

      </div>
      <div className="overflow-y-auto max-h-[50vh] bg-white p-4 rounded w-full h-full">
        <VideoPlayer
          videoUrl={currentVideo.video_name}
          frame_idx={currentVideo.frame_idx}

        />
      </div>
    </div>
  );
};