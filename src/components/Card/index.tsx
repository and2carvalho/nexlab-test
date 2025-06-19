import Image from "next/image";
import MainButton from "@/components/Button";

import styles from '@/app/page.module.css'
import cameraStyles from '@/components/Camera/index.module.css'

interface CardProps {
    imageData: string;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
    onFinish: () => void;
    imgQrCode?: string | null;
}

export default function Card({
    imageData,
    imgQrCode,
    onCancel,
    onConfirm,
    onFinish
}: CardProps) {
    return (
        <div
            className={styles.container}

        >
            <div className={`${styles.container} ${styles.card}`}>
                <div className={styles.inAppHeader}>
                    <Image
                        src={"/logo.png"}
                        width={120}
                        height={80}
                        alt="logo"
                        style={{ transform: 'translateY(5px)' }}
                    />
                    <p>We make tech simple _</p>

                </div>
                <div
                    className={cameraStyles.cameraFrame}
                >
                    <Image
                        src={imageData}
                        width={640}
                        height={480}
                        alt="Imagem capturada"
                        objectFit="contain"
                    />
                </div>
                {imgQrCode && (
                    <div
                        style={{
                            position: 'fixed',
                            top: `60%`,
                            right: `7%`,
                            borderRadius: 10,
                            padding: 10,
                            backgroundColor: 'rgb(var(--gray-rgb))',
                        }}>
                        <div style={{ paddingBottom: 10 }}>
                            <p><b>Fazer download</b></p>
                        </div>
                        <Image
                            src={imgQrCode}
                            alt="img-qr-code"
                            width={180}
                            height={180}
                            style={{ borderRadius: 10 }}
                        />
                    </div>
                )}
                <div className={styles.inAppFooter}>
                    <p>We make tech simple_</p>
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: `100%`,
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
                    linkHref="/checkout"
                    onClick={onFinish}
                />}
            </div>
        </div>
    )
}