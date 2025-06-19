'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "../page.module.css";
import cameraStyles from '@/components/Camera/index.module.css'
import { useEffect, useState, useRef, useCallback } from "react";
import Camera, { CameraRef } from "@/components/Camera";
import Card from "@/components/Card";
import { useAppContext } from "@/context";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";


export default function Checkin() {

    const router = useRouter();
    const { generatedQrCode, setGeneratedQrCode } = useAppContext();

    const cameraRef = useRef<CameraRef>(null);

    const [loadingCamera, setLoadingCamera] = useState(true);
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showImageTaken, setShowImageTaken] = useState(false);
    const [showCountDown, setShowCountDown] = useState(false);

    const [imageData, setImageData] = useState<string | null>(null);
    const [countDown, setCountDown] = useState(3);

    const initializeApp = useCallback(() => {
        setImageData(null);
        setGeneratedQrCode(null);
        setShowImageTaken(false);
        setShowCountDown(false);
        setCountDown(3);
        setLoadingCamera(true);
        setTimeout(() => setLoadingCamera(false), 2000);
    }, [setGeneratedQrCode]);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (showCountDown) {
            interval = setInterval(() => {
                setCountDown(prev => {
                    if (prev === 1) {
                        clearInterval(interval!);

                        if (cameraRef.current) {
                            cameraRef.current.takePhoto();
                        }

                        setTimeout(() => {
                            setShowCountDown(false);
                        }, 1000);
                        return 1;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [showCountDown]);

    const handleCapturedImage = useCallback((imageDataUrl: string) => {
        console.log('Imagem capturada:', imageDataUrl);
        setImageData(imageDataUrl);
        setShowImageTaken(true);

    }, []);

    const handleStartCaptureProcess = () => {
        if (!loadingCamera && !showCountDown && !showImageTaken) {
            setCountDown(3);
            setShowCountDown(true);
        }
    };

    if (loadingCamera) {
        return (
            <div className={styles.container} style={{ height: '100vh' }}>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className={styles.container} style={{ height: '100vh' }}>
            {!loadingCamera && (

                <div>
                    <Camera ref={cameraRef} onCapture={handleCapturedImage} />

                    {/* Contagem Regressiva */}
                    {showCountDown && (
                        <div className={styles.overlay}>
                            <p className={styles.countdownText}>{countDown}</p>
                        </div>
                    )}

                    {/* Botão para iniciar a captura */}
                    {!showCountDown && !showImageTaken && (
                        <div className={cameraStyles.cameraControls}>
                            <button
                                onClick={handleStartCaptureProcess}
                                className={cameraStyles.cameraButton}
                            />
                        </div>
                    )}
                </div>
            )}
            {showImageTaken && imageData && (
                <div className={styles.overlay}>
                    <Card
                        imageData={imageData}
                        onCancel={() => initializeApp()}
                        onConfirm={async () => {
                            setLoadingCamera(true);
                            try {
                                const sendImg = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: JSON.stringify({ imageData }),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });
                                if (!sendImg.ok) {
                                    console.log("erro ao enviar a imagem. Status:", sendImg.status);
                                    throw new Error("Erro ao enviar a imagem");
                                }
                                const responseImg = await sendImg.json();
                                setGeneratedQrCode(responseImg.imgQrCode);
                                setLoadingCamera(false);
                            } catch (e) {
                                console.log(e);
                                setLoadingCamera(false);
                            }
                        }}
                        onFinish={async () => {
                            setIsModalOpen(true);
                            setIsLoadingCheckout(true)
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            setIsLoadingCheckout(false)
                            setIsModalOpen(false);
                            router.push('/checkout');
                        }}
                        isLoading={isLoadingCheckout}
                        imgQrCode={generatedQrCode}
                    />
                    <Modal
                        visible={isModalOpen}
                        title="Obrigado!"
                        description="Loren ipso loren ipsum loren ipso loren ispsu"
                    />
                </div>
            )}

        </div>
    );
}