import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useState } from "react";
import { isDesktop, isIOS } from "react-device-detect";
import tunnel from "tunnel-rat";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openShareTray(blob: Blob, filename: string) {
  if (isDesktop) {
    downloadBlob(blob, filename);
    return;
  }

  const files = [new File([blob], filename)];

  if (!navigator.canShare({ files })) {
    downloadBlob(blob, filename);
    return;
  }

  const shareData = {
    files,
  };

  if (navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData).catch((error) => {
      console.error("Error:", error);
    });
  }
}

export const RecorderTunnel = tunnel();

export function Recorder() {
  const fps = 60;
  const canvas = useThree((state) => state.gl.domElement);
  const mediaRecorder = useMemo(() => {
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream);
    return recorder;
  }, [canvas]);

  useLayoutEffect(() => () => mediaRecorder.stop(), [mediaRecorder]);

  const [isRecording, setIsRecording] = useState(false);

  const onImage = () => {
    canvas.toBlob((blob) => {
      if (blob) {
        openShareTray(blob, `screenshot.png`);
      } else {
        console.error("Failed to capture image from canvas.");
      }
    }, "image/png");
  };

  const onVideoStart = () => {
    setIsRecording(true);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        openShareTray(event.data, isIOS ? `recording.mp4` : `recording.webm`);
      }
    };
    mediaRecorder.onerror = (error) => {
      console.error("MediaRecorder error:", error);
    };
  };

  const onVideoStop = () => {
    setIsRecording(false);
    mediaRecorder.stop();
  };

  return (
    <RecorderTunnel.In>
      <div
        style={{
          position: "absolute",
          bottom: "8rem",
          right: "1rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "white",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: isRecording
              ? "rgba(255, 0, 0, 0.5)"
              : "rgba(0, 0, 0, 0.5)",
            border: "1px solid white",
            fontSize: "1.5rem",
          }}
          onClick={isRecording ? onVideoStop : onVideoStart}
        >
          {isRecording ? "Stop Recording Video" : "Start Recording Video"}
        </button>

        <button
          style={{
            padding: "10px 20px",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "1px solid white",
            fontSize: "1.5rem",
          }}
          onClick={onImage}
        >
          Capture Image
        </button>
      </div>
    </RecorderTunnel.In>
  );
}
