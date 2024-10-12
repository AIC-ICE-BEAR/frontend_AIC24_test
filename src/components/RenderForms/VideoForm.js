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
  const [hoverTime, setHoverTime] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFrames, setImageFrames] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [videoFPS, setVideoFPS] = useState(25);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { submittedImages, setsubmittedImages } = useCSVPreview();

  const handleOpenImageInNewTab = (video_name) => {
    const videoUrl = `${video_name.includes('_a') ? `${process.env.REACT_APP_VIDEO_PATH}/${video_name}.mp4`
      : `${process.env.REACT_APP_VIDEO_PATH}/${video_name}_480p.mp4`}`;
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

  // useEffect(() => {
  //   const fetchImageList = async () => {
  //     try {
  //       const imageList = await getImageListFromCSV(videoUrl);
  //       const updatedImageList = imageList.slice(0, -1); // Remove the last image if needed
  //       setImageFrames(updatedImageList);

  //       if (videoRef.current) {
  //         const videoDuration = videoRef.current.duration;
  //         const mappedImages = updatedImageList.map((frame, index) => {
  //           const frameTime = frame.time;
  //           const nextFrameTime = updatedImageList[index + 1]?.time || videoDuration; // Handle the last frame

  //           return {
  //             frame,
  //             startTime: frameTime,
  //             endTime: nextFrameTime,
  //           };
  //         });

  //         setPreloadedImages(mappedImages);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching image list:', error);
  //     }
  //   };

  //   if (videoUrl) {
  //     fetchImageList();
  //   }
  // }, [videoUrl]);

  // Preload images when the component mounts
  useEffect(() => {
    imageFrames.forEach((image) => {
      const img = new Image();
      img.src = image.imageUrl;
    });
  }, [imageFrames]);

  const getPreloadedImage = (hoverTime) => {
    const preloadedImage = preloadedImages.find(
      (image) => hoverTime >= image.startTime && hoverTime <= image.endTime
    );
    return preloadedImage ? preloadedImage.frame : null;
  };

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

  const findClosestImage = (hoverTime) => {
    if (imageFrames.length === 0) return null;
    let low = 0;
    let high = imageFrames.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midTime = imageFrames[mid].time;

      if (midTime === hoverTime) {
        return imageFrames[mid];
      } else if (midTime < hoverTime) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const closest = (low < imageFrames.length && high >= 0)
      ? (Math.abs(imageFrames[low]?.time - hoverTime) < Math.abs(imageFrames[high]?.time - hoverTime) ? imageFrames[low] : imageFrames[high])
      : imageFrames[low] || imageFrames[high];

    return closest;
  };

  const handleMouseMove = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverPosX = e.clientX - rect.left;
    const percentage = hoverPosX / rect.width;
    const hoverTime = videoRef.current.duration * percentage;

    setHoverTime(hoverTime);
    const preloadedImage = getPreloadedImage(hoverTime);
    setPreviewImage(preloadedImage);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setPreviewImage(null);
  };

  // const handleProgressBarClick = (e) => {
  //   try {
  //     const rect = progressBarRef.current.getBoundingClientRect();
  //     const clickPosX = e.clientX - rect.left;
  //     const percentage = clickPosX / rect.width;
  //     const clickedTime = videoRef.current.duration * percentage;
  //     videoRef.current.currentTime = clickedTime;
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  const getCurrentTime = () => {
    const currentTime = videoRef.current.currentTime;
    const frame = Math.floor(currentTime * videoFPS);
    const closestImage = findClosestImage(currentTime);
    submittedImages.push({ text: `${videoUrl.split('/').pop()}, ${frame}`, image: closestImage.imageUrl.split('/').pop().slice(0, -4) });
  };

  return (
    <div className="relative w-fit">
      <video
        ref={videoRef}
        controls
        width="600"
        autoPlay
        muted
        controlsList="nodownload"
        style={{ '--moz-media-controls-timeline': 'none' }}
      >
        <source
          src={
            videoUrl.includes('_a')
              ? `${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}_480p.mp4`
              : `${process.env.REACT_APP_VIDEO_PATH}/${videoUrl}_480p.mp4`
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Preload images but keep them hidden */}
      <div className="hidden">
        {imageFrames.map((image) => (
          <img key={image.imageUrl} src={image.imageUrl} alt="" />
        ))}
      </div>

      <div className="absolute top-0 left-0 pointer-events-none flex justify-start items-center px-4">
        <button
          className="p-4 bg-transparent text-gray-300 rounded hover:text-gray-300 opacity-75 pointer-events-auto"
          onClick={() => handleOpenImageInNewTab(videoUrl)}
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
      {/* <div
        className="relative w-full h-4 bg-gray-200 mt-2"
        ref={progressBarRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleProgressBarClick}
        style={{ cursor: "pointer" }}
      >
        <div
          className="absolute left-0 top-0 h-full bg-red-500"
          style={{
            width: `${(videoRef.current && videoRef.current.duration > 0
              ? (videoRef.current.currentTime / videoRef.current.duration) * 100
              : 0)}%`,
          }}
        />
        {previewImage && hoverTime && (
          <div
            className="fixed bg-black text-white p-2"
            style={{
              left: `${mousePosition.x + 150}px`,
              top: `${mousePosition.y - 50}px`,
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <img src={previewImage.imageUrl} alt="Preview" width="160" height="90" />
            <span>{Math.floor(hoverTime)}s</span>
          </div>
        )}
      </div> */}
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