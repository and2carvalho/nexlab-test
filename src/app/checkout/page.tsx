'use client';

import styles from '@/app/page.module.css'
import MainButton from '@/components/Button'
import InAppHeader from '@/components/InAppHeader';
import { useAppContext } from '@/context'
import Image from 'next/image'

export default function Checkout() {
    const { generatedQrCode, setGeneratedQrCode } = useAppContext()
    return (
        <div className={styles.page}>
            
            <InAppHeader />

            <main
                className={styles.main}
            >
                <div className={styles.container} >
                    <h2>Obrigado!</h2>
                    <p
                        style={{
                            paddingInline: 20,
                            textAlign: 'center',
                            marginTop: 10,
                            maxWidth: '280px'
                        }}
                    >
                        Lorem ipsum lorem ipsum lorem ipsum ipsum loren
                    </p>
                    <div style={{
                        borderRadius: 10,
                        padding: 7,
                        marginTop: 40,
                        border: '3px solid rgb(var(--gray-rgb))',
                    }}>
                        <Image
                            src={generatedQrCode || "/placeholder-qr.png"}
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