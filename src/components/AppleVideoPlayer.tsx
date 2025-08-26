import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings } from 'lucide-react';

interface AppleVideoPlayerProps {
  videoUrl: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

export const AppleVideoPlayer: React.FC<AppleVideoPlayerProps> = ({ 
  videoUrl, 
  onProgress, 
  onComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative bg-black rounded-xl md:rounded-2xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video object-cover"
        onClick={togglePlay}
      />
      
      {/* Apple-style Controls */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls || true ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-orange-500/20 backdrop-blur-md hover:bg-orange-500/30 rounded-full p-4 md:p-6 transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
          
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 md:mb-4 group/progress"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-orange-500 rounded-full relative transition-all duration-150"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2 md:space-x-4">
              
              <button
                onClick={togglePlay}
                className="hover:text-orange-400 transition-colors p-1"
              >
                {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <button
                onClick={() => skip(-10)}
                className="hover:text-orange-400 transition-colors p-1"
              >
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <button
                onClick={() => skip(10)}
                className="hover:text-orange-400 transition-colors p-1"
              >
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button className="hover:text-orange-400 transition-colors p-1 hidden md:block">
                <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <span className="text-xs md:text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* Speed Control */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="hover:text-orange-400 transition-colors flex items-center space-x-1 p-1"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm font-medium">{playbackRate}×</span>
                </button>
                
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-xl p-2 min-w-[80px]">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => changePlaybackRate(speed)}
                        className={`block w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-white/10 rounded-lg transition-colors ${
                          playbackRate === speed ? 'text-orange-400' : 'text-white'
                        }`}
                      >
                        {speed}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="hover:text-orange-400 transition-colors p-1">
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};