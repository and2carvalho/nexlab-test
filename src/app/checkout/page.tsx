'use client';

import styles from '@/app/page.module.css'
import MainButton from '@/components/Button'
import InAppHeader from '@/components/InAppHeader';
import { useAppContext } from '@/context'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Checkout() {

    const router = useRouter()
    const { generatedQrCode, setGeneratedQrCode } = useAppContext()
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    // volta para tela inicial automaticamente apos 8 seg
    // caso o usuário não retorne
    useEffect(() => {
        timeoutIdRef.current = setTimeout(() => {
            router.push("/")
            setGeneratedQrCode(null)
        }, 8000)

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
            }
        }
    }, [])

    return (
        <div className={styles.page}>

            <InAppHeader />

            <main
                className={styles.main}
            >
                <div className={styles.container} >
                    <h2>Obrigado!</h2>
                    <p className={styles.checkoutDescription}>
                        Lorem ipsum lorem ipsum lorem ipsum ipsum loren
                    </p>
                    <div className={styles.checkoutQrCodeWrapper}>
                        <Image
                            src={generatedQrCode || ""}
                            height={180}
                            width={180}
                            alt='img-qr-code'
                        />
                    </div>
                </div>
            </main>

            <div className={styles.inAppFooter}>
                <MainButton
                    label="Finalizar"
                    linkHref="/"
                    onClick={() => setTimeout(() => setGeneratedQrCode(null), 800)}
                />
            </div>
        </div>
    )
}