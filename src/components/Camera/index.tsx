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
            const tracks = mediaStreamRef.current.getTracks();
            if (tracks.length > 0 && tracks[0].readyState === 'live') {
                console.log("Câmera já está ativa e o stream está ao vivo.");
                if (videoRef.current && videoRef.current.srcObject === mediaStreamRef.current) {
                    console.log("VideoRef já está conectado e reproduzindo.");
                    return; // Já está rodando e visível
                }
            } else {
                console.warn("Stream anterior não está ativo ou não conectado, tentando reiniciar.");
                stopCamera();
            }
        }
        try {
            console.log("Tentando acessar a câmera com getUserMedia...");
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: false
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaStreamRef.current = mediaStream;
            setHasPermission(true);
            console.log("Permissão da câmera concedida e stream obtido.");

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    console.log("Metadados do vídeo carregados. Dimensões:", videoRef.current?.videoWidth, videoRef.current?.videoHeight);
                    videoRef.current?.play().catch(playErr => {
                        if (playErr.name === "AbortError") {
                            console.warn("Reprodução do vídeo interrompida. Isso pode acontecer ao recarregar rapidamente.");
                        } else if (playErr.name === "NotAllowedError") {
                            setError('Reprodução automática bloqueada. Clique para iniciar o vídeo.');
                            console.error("Erro ao reproduzir vídeo: ", playErr);
                        }
                        else {
                            console.error("Erro ao reproduzir vídeo:", playErr);
                        }
                    });
                };
                console.log("srcObject atribuído ao vídeo.");
            }
        } catch (err) {
            console.error("Erro ao acessar a câmera:", err);
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    setError('Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações do seu navegador.');
                } else if (err.name === 'NotFoundError') {
                    setError('Nenhuma câmera encontrada no dispositivo.');
                } else if (err.name === 'NotReadableError') {
                    setError('A câmera está sendo usada por outra aplicação ou o hardware não está disponível.');
                } else if (err.name === 'OverconstrainedError') {
                    setError(`As configurações da câmera solicitadas não puderam ser atendidas: ${err.message}.`);
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