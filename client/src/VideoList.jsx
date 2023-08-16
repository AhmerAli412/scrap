import React, { useState, useEffect } from 'react';
import videojs from 'video.js';
import axios from 'axios';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get('/videos');
      setVideos(response.data.videos);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    videos.forEach((videoUrl) => {
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      document.getElementById('videos-container').appendChild(videoElement);
      videojs(videoElement);
    });
  }, [videos]);

  return (
    <div>
      <h1>Videos</h1>
      <div id="videos-container"></div>
    </div>
  );
};

export default VideoList;
