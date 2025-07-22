import { Box, AspectRatio, Icon, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaExpand } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const CustomVideoPlayer = ({ videoId, title, onProgress, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const iframeRef = useRef(null);

  // YouTube iframe API parameters for minimal branding
  const youtubeParams = [
    'rel=0',           // No related videos
    'showinfo=0',      // No video info
    'controls=1',      // Show controls
    'modestbranding=1', // Minimal YouTube branding
    'fs=1',            // Allow fullscreen
    'cc_load_policy=0', // No captions by default
    'iv_load_policy=3', // No annotations
    'autohide=1',      // Hide controls when not used
    'playsinline=1',   // Play inline on mobile
    'enablejsapi=1',   // Enable JavaScript API
    'origin=' + window.location.origin
  ].join('&');

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${youtubeParams}`;

  return (
    <Box position="relative" borderRadius="16px" overflow="hidden" boxShadow="2xl">
      {/* Custom overlay with course branding */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg="linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
        p={4}
        pointerEvents="none"
      >
        <VStack align="start" spacing={1}>
          <Text color="white" fontSize="lg" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.8)">
            {title}
          </Text>
          <HStack spacing={2}>
            <Box bg="rgba(59, 130, 246, 0.8)" px={2} py={1} borderRadius="full">
              <Text color="white" fontSize="xs" fontWeight="bold">
                Curso Barmitzva
              </Text>
            </Box>
            <Box bg="rgba(245, 158, 11, 0.8)" px={2} py={1} borderRadius="full">
              <Text color="white" fontSize="xs" fontWeight="bold">
                Eli Levy
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>

      {/* Video Player */}
      <AspectRatio ratio={16/9}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          allowFullScreen
          style={{
            border: 'none',
            borderRadius: '16px',
          }}
          onLoad={() => {
            // Video loaded
            if (onProgress) {
              onProgress(0);
            }
          }}
        />
      </AspectRatio>

      {/* Custom bottom overlay */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
        bg="linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)"
        p={4}
        pointerEvents="none"
      >
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FaPlay} color="white" boxSize={4} />
            <Text color="white" fontSize="sm" fontWeight="medium">
              Reproducir video
            </Text>
          </HStack>
          <Text color="white" fontSize="sm">
            📚 barmitzvatop.com
          </Text>
        </HStack>
      </Box>

      {/* Progress indicator */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="4px"
        bg="rgba(255,255,255,0.3)"
        zIndex={5}
      >
        <Box
          height="100%"
          bg="#3B82F6"
          width={`${(currentTime / duration) * 100}%`}
          transition="width 0.3s"
        />
      </Box>
    </Box>
  );
};

export default CustomVideoPlayer;