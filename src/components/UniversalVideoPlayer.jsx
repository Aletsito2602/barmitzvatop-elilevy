import { Box, AspectRatio } from '@chakra-ui/react';
import { useRef } from 'react';

const UniversalVideoPlayer = ({ videoUrl, videoType, title, onProgress, onComplete }) => {
  const iframeRef = useRef(null);

  const renderYouTubePlayer = () => {
    // Extraer video ID de YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return null;

    const youtubeParams = [
      'rel=0',
      'showinfo=0',
      'controls=1',
      'modestbranding=1',
      'fs=1',
      'cc_load_policy=0',
      'iv_load_policy=3',
      'autohide=1',
      'playsinline=1',
      'enablejsapi=1',
      'origin=' + window.location.origin
    ].join('&');

    const embedUrl = `https://www.youtube.com/embed/${videoId}?${youtubeParams}`;

    return (
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        allowFullScreen
        style={{
          border: 'none',
          borderRadius: '16px',
          width: '100%',
          height: '100%'
        }}
        onLoad={() => {
          if (onProgress) onProgress(0);
        }}
      />
    );
  };

  const renderVimeoPlayer = () => {
    // Extraer video ID de Vimeo
    const regExp = /(?:vimeo\.com\/)([0-9]+)/;
    const match = videoUrl.match(regExp);
    const videoId = match ? match[1] : null;

    if (!videoId) return null;

    const vimeoParams = [
      'color=3B82F6',
      'title=0',
      'byline=0',
      'portrait=0',
      'badge=0',
      'autopause=0',
      'player_id=0',
      'app_id=58479'
    ].join('&');

    const embedUrl = `https://player.vimeo.com/video/${videoId}?${vimeoParams}`;

    return (
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        allowFullScreen
        style={{
          border: 'none',
          borderRadius: '16px',
          width: '100%',
          height: '100%'
        }}
        onLoad={() => {
          if (onProgress) onProgress(0);
        }}
      />
    );
  };

  const renderCustomPlayer = () => {
    return (
      <video
        ref={iframeRef}
        controls
        style={{
          borderRadius: '16px',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onLoadStart={() => {
          if (onProgress) onProgress(0);
        }}
        onEnded={() => {
          if (onComplete) onComplete();
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Tu navegador no soporta el elemento de video.
      </video>
    );
  };

  const renderPlayer = () => {
    switch (videoType) {
      case 'youtube':
        return renderYouTubePlayer();
      case 'vimeo':
        return renderVimeoPlayer();
      case 'personalizado':
        return renderCustomPlayer();
      default:
        return renderYouTubePlayer(); // Fallback a YouTube
    }
  };

  return (
    <Box borderRadius="16px" overflow="hidden" boxShadow="2xl">
      <AspectRatio ratio={16/9}>
        <Box>
          {renderPlayer()}
        </Box>
      </AspectRatio>
    </Box>
  );
};

export default UniversalVideoPlayer;