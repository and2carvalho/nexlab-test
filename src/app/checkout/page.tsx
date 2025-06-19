'use client';

import styles from '@/app/page.module.css'
import MainButton from '@/components/Button'
import { useAppContext } from '@/context'
import Image from 'next/image'

export default function Checkout() {
    const { generatedQrCode, setGeneratedQrCode } = useAppContext()
    return (
        <div className={styles.page}>
            <Image
                className={styles.logo}
                src="/logo.png"
                alt="NexLab logo"
                width={120}
                height={80}
            />
            <main
                className={""}
                style={{
                }}
            >
                <div className={styles.container} >
                    <div style={{
                        marginBlock: 'auto',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: `center`,
                        justifyContent: `center`
                    }}>
                        <h2>Obrigado!</h2>
                        <p
                            style={{
                                paddingInline: 80,
                                textAlign: 'center',
                                marginTop: 10
                            }}
                        >
                            Loren ipso loren ipsum loren ipso loren ipsum
                        </p>
                        <div style={{
                            borderRadius: 10,
                            padding: 7,
                            marginTop: 40,
                            border: '3px solid rgb(var(--gray-rgb))',
                        }}>
                            <Image
                                src={generatedQrCode || ""}
                                height={180}
                                width={180}
                                alt='img-qr-code'
                            />
                        </div>
                    </div>
                </div>

                <MainButton
                    label="Finalizar"
                    linkHref="/"
                    onClick={() => setTimeout(() => setGeneratedQrCode(null), 800)
                        
                    }
                />

            </main>
        </div>
    )
}