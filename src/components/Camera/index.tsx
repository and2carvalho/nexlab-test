'use client';

import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import styles from "./index.module.css";

interface CameraProps {
    onCapture: (imageDataUrl: string) => void;
}

export interface CameraRef {
    takePhoto: () => void;
}

const Camera = forwardRef<CameraRef, CameraProps>(({ onCapture }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        setVideoPlaying(false);
    }, []);

    const startCamera = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    facingMode: "user"
                },
                audio: false
            });

            mediaStreamRef.current = mediaStream;

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Tentar reprodução automática
                videoRef.current.onloadedmetadata = async () => {
                    try {
                        await videoRef.current?.play();
                        setVideoPlaying(true);
                    } catch {
                        setVideoPlaying(false);
                    }
                    setIsLoading(false);
                };
            }
        } catch (err) {
            setIsLoading(false);
            if (err instanceof DOMException) {
                switch (err.name) {
                    case 'NotAllowedError':
                        setError('Permissão negada. Permita acesso à câmera.');
                        break;
                    case 'NotFoundError':
                        setError('Nenhuma câmera encontrada.');
                        break;
                    case 'NotReadableError':
                        setError('Câmera em uso ou indisponível.');
                        break;
                    default:
                        setError(`Erro: ${err.message}`);
                }
            } else {
                setError('Não foi possível acessar a câmera.');
            }
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const takePhoto = useCallback(() => {
        if (videoRef.current && photoRef.current && videoPlaying) {
            const context = photoRef.current.getContext('2d');
            if (context) {
                photoRef.current.width = videoRef.current.videoWidth;
                photoRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                onCapture(photoRef.current.toDataURL('image/png'));
            }
        }
    }, [onCapture, videoPlaying]);

    useImperativeHandle(ref, () => ({ takePhoto }));

    return (
        <div className={styles.cameraWrapper}>
            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

            <div className={styles.cameraFrame}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: videoPlaying ? 'block' : 'none'
                    }}
                />

                <canvas ref={photoRef} style={{ display: 'none' }} />

                {!isLoading && !videoPlaying && !error && (
                    <button
                        className={styles.initiateVideoButton}
                        onClick={async () => {
                            try {
                                if (videoRef.current?.srcObject) {
                                    await videoRef.current.play();
                                    setVideoPlaying(true);
                                }
                            } catch {
                                setError('Falha ao iniciar a câmera');
                            }
                        }}
                    >
                        Clique para Iniciar Vídeo
                    </button>
                )}

                {isLoading && !error && (
                    <div className={styles.loadingCameraAlert}>
                        Carregando câmera...
                    </div>
                )}
            </div>
        </div>
    );
});

Camera.displayName = "Camera";
export default Camera;