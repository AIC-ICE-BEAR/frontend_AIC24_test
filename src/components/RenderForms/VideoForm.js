import React, { useRef, useEffect, useState } from "react";
import { BsSkipForward, BsSkipBackward } from "react-icons/bs"; // Import the icons
import { mapKeyframe } from '../utils/utils';
import { FaLink } from "react-icons/fa";
const VideoPlayer = ({ videoUrl, frame_idx }) => {
  const videoRef = useRef(null);
  const videoSpeed = 30;
  const [startTime, setStartTime] = useState(0);


  const handleOpenImageInNewTab = (video_name) => {

    const videoUrl = `${process.env.REACT_APP_VIDEO_PATH}/${video_name}_480p.mp4`;
    window.open(videoUrl, '_blank');
  };


  useEffect(() => {
    if (videoUrl) {
      mapKeyframe(videoUrl, frame_idx)
        .then(result => {
          console.log("Video start", videoUrl, result.frameIdx / result.videoSpeed)
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

  // Function to skip forward by 5 seconds
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  // Function to skip backward by 5 seconds
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  return (
    <div className="relative w-fit">
      <video ref={videoRef} controls width="600" autoPlay muted>
        <source
          src={`${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}_480p.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* direct link to video*/}
      <div className="absolute top-0 left-0 pointer-events-none flex justify-start items-center px-4">
        <button
          className="p-4 bg-transparent text-gray-300 rounded hover:text-gray-300 opacity-75 pointer-events-auto"
          onClick={() => {
            handleOpenImageInNewTab(videoUrl)
          }}
          alt="direct-link"
        >
          <FaLink size={30} />
        </button>

      </div>
      {/* Skip and Back buttons*/}
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
    </div>
  );
};

export default VideoPlayer;


// Separate Modal Component for Video Player
export const VideoModal = ({ currentVideo, setCurrentVideo, setwatchVideoformVisible }) => {
  return (
    <div className="h-1/2 w-full bg-opacity-50 flex items-center justify-center z-50">
      <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setwatchVideoformVisible(false)}>
        Close
      </button>
      <div className="overflow-y-auto max-h-[50vh] bg-white p-4 rounded w-full h-full">
        <VideoPlayer

          videoUrl={currentVideo.video_name}
          frame_idx={currentVideo.frame_idx}
        />
      </div>
    </div>
  );
};
