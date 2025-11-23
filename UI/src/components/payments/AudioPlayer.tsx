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
import React, { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
    data: string; // Ensure this is a valid audio URL
    thumbnail: string; // Thumbnail image URL
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ data, thumbnail }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Reload when data changes
        }
    }, [data]);

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

    const onProgressChange = (_: Event, value: number | number[]) => {
        if (audioRef.current && typeof value === "number") {
            const time = (value / 100) * duration;
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    return (
        <Card sx={{ maxWidth: "100%", backgroundColor: "#252525", color: "#fff", borderRadius: "20px", p: 2, textAlign: "center" }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Now Playing</Typography>
                <Box
                    component="img"
                    src={thumbnail}
                    alt="Thumbnail"
                    sx={{ width: "100%", height: 200, borderRadius: "10px", objectFit: "cover", mb: 2 }}
                />
                <audio
                    ref={audioRef}
                    src={data}
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                />
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <IconButton onClick={togglePlay} color="primary" sx={{ backgroundColor: "#444", p: 2, borderRadius: "50%" }}>
                        {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                    </IconButton>
                </Box>
                <Slider
                    value={(currentTime / duration) * 100 || 0}
                    onChange={onProgressChange}
                    aria-labelledby="audio-progress"
                    sx={{ color: "#fff", mt: 2 }}
                />
                <Typography variant="body2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AudioPlayer;
