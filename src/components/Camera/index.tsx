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
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaStreamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        setError(null);
        if (mediaStreamRef.current) {
            console.log("Câmera já está ativa.");
            // Verificar se o stream ainda está ativo e a câmera visível
            const tracks = mediaStreamRef.current.getTracks();
            if (tracks.length > 0 && videoRef.current && videoRef.current.srcObject) {
                // Já está rodando e visível
                return;
            } else {
                stopCamera();
            }
        }
        try {
            console.log("Tentando acessar a câmera...");
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            mediaStreamRef.current = mediaStream;
            setHasPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play().catch(playErr => {
                    if (playErr.name === "AbortError") {
                        console.warn("Reprodução do vídeo interrompida. Isso pode acontecer ao recarregar rapidamente.");
                    } else {
                        console.error("Erro ao reproduzir vídeo:", playErr);
                    }
                });
                console.log("Câmera iniciada e reproduzindo.");
            }
        } catch (err) {
            console.error("Erro ao acessar a câmera:", err);
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    setError('Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações do seu navegador.');
                } else if (err.name === 'NotFoundError') {
                    setError('Nenhuma câmera encontrada no dispositivo.');
                } else if (err.name === 'NotReadableError') {
                    setError('A câmera está sendo usada por outra aplicação. Por favor, feche-a e tente novamente.');
                }
                else {
                    setError(`Erro desconhecido ao acessar a câmera: ${err.message}`);
                }
            } else {
                setError('Não foi possível acessar a câmera.');
            }
            setHasPermission(false);
        }
    }, [stopCamera]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const takePhoto = useCallback(() => {
        if (videoRef.current && photoRef.current) {
            const context = photoRef.current.getContext('2d');
            if (context) {
                photoRef.current.width = videoRef.current.videoWidth;
                photoRef.current.height = videoRef.current.videoHeight;

                context.drawImage(videoRef.current, 0, 0, photoRef.current.width, photoRef.current.height);

                const imageDataUrl = photoRef.current.toDataURL('image/png');
                onCapture(imageDataUrl);
            }
        }
    }, [onCapture]);


    useImperativeHandle(ref, () => ({
        takePhoto,
    }));

    return (
        <div className={styles.cameraWrapper}>
            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
            {!hasPermission && !error && <p>Aguardando permissão da câmera...</p>}

            {hasPermission && (
                <div className={styles.cameraFrame}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <canvas
                        ref={photoRef}
                        style={{ display: 'none' }}
                    />
                </div>
            )}

            {!hasPermission && error && (
                <button
                    onClick={startCamera}
                    style={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Tentar Acessar Câmera Novamente
                </button>
            )}
        </div>
    );
});

Camera.displayName = "Camera"
export default Camera;