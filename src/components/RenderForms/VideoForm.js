import React, { useRef, useEffect, useState } from "react";
import { mapKeyframe } from '../utils/utils';

// VideoPlayer Component
// VideoPlayer Component
const VideoPlayer = ({ videoUrl, frame_idx }) => {
  const videoRef = useRef(null);
  const videoSpeed = 30;
  const [startTime, setStartTime] = useState(0);

  // Fetch the start time from keyframe mapping



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

    // Seek to the specified time when video metadata is loaded
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
      video.load(); // Reload video source whenever the startTime changes
    }

    return () => {
      if (video) {
        video.pause(); // Pause the current video
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [startTime]); // Re-run whenever startTime changes

  return (
    <div>
      <video ref={videoRef} controls width="600" autoPlay muted>
        <source
          src={`${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}_480p.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

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
