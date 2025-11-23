import React from "react";

const PDFViewer = ({ url }: any) => {
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <div>
            <h3>PDF Viewer</h3>
            <iframe
                src={googleViewerUrl}
                title="PDF Viewer"
                style={{ width: "100%", height: "500px", border: "none" }}
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default PDFViewer;
