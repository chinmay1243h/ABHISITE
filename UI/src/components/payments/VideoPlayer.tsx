import ReactPlayer from "react-player";

const VideoPlayer = ({ url }: { url: string }) => {
    return (
        <div>
            <h3>Video Player</h3>
            <ReactPlayer url={url} controls width="100%" />
        </div>
    );
};

export default VideoPlayer;
