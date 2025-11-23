import {
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
    Pause,
    PlayArrow
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Slider,
    Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";

// Define the type for the audio data prop
interface AudioData {
  id: number;
  type: string;
  title: string;
  artist: string;
  description: string;
  source: string;
}

interface AudioPlayerProps {
  data: AudioData;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const onProgressChange = (event: Event, value: number | number[]) => {
    const time = ((value as number) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const styles = {
    card: {
      maxWidth: 350,
      minWidth:350,
      backgroundColor: "#1d1b27",
      color: "#fff",
      borderRadius: "20px",
      padding: "20px",
      textAlign: "center" as const,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      marginBottom:'30px',
      zIndex:2,
    },
    albumArt: {
      width: "180px",
      height: "180px",
      backgroundImage: `url(data:image/jpeg;base64,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)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "50%",
      margin: "20px auto",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    },
    slider: {
      color: "#f25d8e",
      marginTop: "20px",
    },
    controls: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "20px",
    },
  };

  return (
    <Card sx={styles.card}>
      <Box sx={styles.albumArt}></Box>
      <CardContent>
        <Typography variant="h6">{data.title}</Typography>
        <Typography variant="subtitle2">{data.artist}</Typography>
        <Box mt={2}>
          <Slider
            sx={styles.slider}
            value={(currentTime / duration) * 100 || 0}
            onChange={onProgressChange}
          />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption">{formatTime(currentTime)}</Typography>
            <Typography variant="caption">{formatTime(duration)}</Typography>
          </Box>
        </Box>
        <Box sx={styles.controls}>
          <IconButton
            color="inherit"
            onClick={() => (audioRef.current!.currentTime -= 10)}
          >
            <KeyboardDoubleArrowLeft />
          </IconButton>
          <IconButton
            style={{
              background: "#26262e",
            }}
            color="inherit"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => (audioRef.current!.currentTime += 10)}
          >
            <KeyboardDoubleArrowRight />
          </IconButton>

          {/* <IconButton color="inherit">
            <Shuffle />
          </IconButton> */}
        </Box>
        <audio
          ref={audioRef}
          src={data.source}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
