import Image from "next/image";
import MainButton from "@/components/Button";

import styles from '@/app/page.module.css'
import cameraStyles from '@/components/Camera/index.module.css' // Usaremos cameraStyles.cameraFrame

interface CardProps {
    imageData: string;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
    onFinish: () => void;
    imgQrCode?: string | null;
    isLoading?: boolean;
}

export default function Card({
    imageData,
    imgQrCode,
    onCancel,
    onConfirm,
    onFinish,
    isLoading,
}: CardProps) {
    return (
        <div className={`${styles.card} ${styles.container}`}>
            <div
                className={styles.inAppHeader}
                style={{
                    backgroundColor: 'transparent',
                    padding: '10px 0',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(var(--gray-rgb), 0.2)',
                    marginBottom: '10px'
                }}>
                <Image
                    src={"/logo.png"}
                    width={100}
                    height={60}
                    alt="logo"
                />
                <p>We make tech simple _</p>
            </div>

            <div
                className={cameraStyles.cameraFrame}
                style={{
                    marginBottom: '20px',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px'
                }}
            >
                <Image
                    src={imageData}
                    width={640}
                    height={480}
                    alt="Imagem capturada"
                    style={{ objectFit: 'contain' }}
                />
            </div>

            {imgQrCode && (
                <div className={styles.cardTag}>
                    <p style={{ fontWeight: 600, marginBottom: 5 }}>Fazer download</p>
                    <Image
                        src={imgQrCode}
                        alt="img-qr-code"
                        width={120}
                        height={120}
                        style={{ borderRadius: 8 }}
                    />
                </div>
            )}

            <div className={styles.inAppFooter} style={{
                backgroundColor: 'transparent',
                padding: '10px 0',
                borderTop: '1px solid rgba(var(--gray-rgb), 0.2)',
                marginTop: '10px'
            }}>
                <p>We make tech simple_</p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                width: `100%`,
                marginTop: '20px'
            }}>
                {!imgQrCode ? (
                    <>
                        <MainButton
                            label="Refazer"
                            variant="gosht"
                            small
                            onClick={onCancel}
                        />
                        <MainButton
                            label="Continuar"
                            small
                            onClick={onConfirm}
                        />
                    </>
                ) : <MainButton
                    label="Finalizar"
                    onClick={onFinish}
                    disabled={isLoading}
                />}
            </div>
        </div>
    )
}