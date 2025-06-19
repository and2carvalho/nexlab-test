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
    const [videoPlaying, setVideoPlaying] = useState(false);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (mediaStreamRef.current) {
            console.log("Parando tracks do MediaStream...");
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            // Remover o listener de onloadedmetadata ao parar a câmera
            videoRef.current.onloadedmetadata = null;
            console.log("srcObject do vídeo limpo e listener de metadados removido.");
        }
        setVideoPlaying(false);
    }, []);

    const startCamera = useCallback(async () => {
        setError(null);
        setVideoPlaying(false);

        // Se já existe um stream ativo e conectado, não tente iniciar novamente.
        if (mediaStreamRef.current && videoRef.current && videoRef.current.srcObject === mediaStreamRef.current) {
            const tracks = mediaStreamRef.current.getTracks();
            if (tracks.length > 0 && tracks[0].readyState === 'live') {
                console.log("Câmera já está ativa, stream ao vivo e conectado ao vídeo.");
                setVideoPlaying(true);
                return;
            }
        }

        if (mediaStreamRef.current) {
            console.warn("Stream anterior detectado, mas não ativo/conectado corretamente. Parando para reiniciar.");
            stopCamera();
        }

        try {
            console.log("Tentando acessar a câmera com getUserMedia...");
            const constraints: MediaStreamConstraints = {
                video: {
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
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

                videoRef.current.onerror = (event) => {
                    console.error("Erro no elemento de vídeo (onerror):", event);
                    setError("Erro ao carregar o stream da câmera no vídeo. Tente recarregar.");
                    setVideoPlaying(false);
                };

                const handleLoadedMetadata = async () => {
                    if (!videoRef.current) return;
                    console.log("Metadados do vídeo carregados. Dimensões:", videoRef.current.videoWidth, videoRef.current.videoHeight);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    try {
                        await videoRef.current.play();
                        console.log("Vídeo da câmera está reproduzindo.");
                        setVideoPlaying(true);
                        // Remover o listener após o sucesso para evitar disparos múltiplos
                        videoRef.current.onloadedmetadata = null;
                    } catch (playErr) {
                        console.error("Erro ao iniciar a reprodução automática do vídeo:", playErr);
                        setVideoPlaying(false);
                        if (playErr instanceof DOMException && playErr.name === "NotAllowedError") {
                            setError('Reprodução automática bloqueada. Por favor, clique no botão "Iniciar Vídeo" para continuar.');
                        } else {
                            if (typeof playErr === "object" && playErr !== null) {
                                const errMsg = (playErr as { message?: string; name?: string }).message || (playErr as { name?: string }).name || 'Erro desconhecido';
                                setError(`Não foi possível iniciar a reprodução do vídeo: ${errMsg}.`);
                            } else {
                                setError("Não foi possível iniciar a reprodução do vídeo: Erro desconhecido.");
                            }
                        }
                    }
                };
                videoRef.current.onloadedmetadata = handleLoadedMetadata; // Atribui o novo handler

                try {
                    await videoRef.current.play();
                    console.log("Tentativa de reprodução imediata iniciada.");
                    setVideoPlaying(true); // Se der certo aqui, já está tocando
                } catch (e) {
                    if (typeof e === "object" && e !== null && "name" in e) {
                        console.warn("Reprodução imediata não iniciada automaticamente (esperado para autoplay policies). Erro:", (e as { name?: string }).name);
                    } else {
                        console.warn("Reprodução imediata não iniciada automaticamente (esperado para autoplay policies). Erro desconhecido.");
                    }
                    setVideoPlaying(false);
                }
            }
        } catch (err) {
            console.error("Erro ao acessar a câmera (getUserMedia):", err);
            setHasPermission(false);
            setVideoPlaying(false);
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    setError('Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações do seu navegador.');
                } else if (err.name === 'NotFoundError') {
                    setError('Nenhuma câmera encontrada no dispositivo.');
                } else if (err.name === 'NotReadableError') {
                    setError('A câmera está sendo usada por outra aplicação ou o hardware não está disponível.');
                } else if (err.name === 'OverconstrainedError') {
                    setError(`As configurações da câmera solicitadas não puderam ser atendidas: ${err.message}.`);
                } else if (err.name === 'SecurityError') {
                    setError('Acesso à câmera bloqueado por questões de segurança (verifique HTTPS).');
                }
                else {
                    setError(`Erro desconhecido ao acessar a câmera: ${err.message}.`);
                }
            } else {
                setError('Não foi possível acessar a câmera. Verifique o console para mais detalhes.');
            }
        }
    }, [stopCamera]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const takePhoto = useCallback(() => {
        if (videoRef.current && photoRef.current && videoPlaying) {
            const context = photoRef.current.getContext('2d');
            if (context) {
                photoRef.current.width = videoRef.current.videoWidth;
                photoRef.current.height = videoRef.current.videoHeight;

                context.drawImage(videoRef.current, 0, 0, photoRef.current.width, photoRef.current.height);

                const imageDataUrl = photoRef.current.toDataURL('image/png');
                onCapture(imageDataUrl);
            }
        } else {
            console.warn("Não é possível tirar foto: Câmera não está ativa ou reproduzindo.");
            setError("Câmera não está pronta para tirar foto. Tente iniciar o vídeo.");
        }
    }, [onCapture, videoPlaying]);

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
                        muted
                        // Adicionar uma borda temporária para depuração visual
                        // style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid blue' }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <canvas
                        ref={photoRef}
                        style={{ display: 'none' }}
                    />

                    {!videoPlaying && !error && (
                        <button
                            onClick={async () => {
                                try {
                                    if (videoRef.current && videoRef.current.srcObject) {
                                        await videoRef.current.play();
                                        setVideoPlaying(true);
                                        console.log("Reprodução manual iniciada.");
                                    } else {
                                        console.warn("Não foi possível iniciar manual: srcObject não pronto.");
                                        setError("Vídeo não está pronto para reprodução. Tente iniciar novamente."); // Mensagem mais clara
                                    }
                                } catch (e) {
                                    console.error("Falha na reprodução manual:", e);
                                    setError("Erro ao iniciar o vídeo manualmente. O navegador pode estar bloqueando. Tente recarregar a página.");
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 100,
                                padding: '10px 20px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Clique para Iniciar Vídeo
                        </button>
                    )}

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