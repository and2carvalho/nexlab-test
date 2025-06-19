'use client';

import styles from '@/app/page.module.css'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export type ImgurImage = {
    id: string;
    title: string | null;
    description: string | null;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    deletehash?: string;
    name?: string;
    section: string | null;
    link: string;
    gifv?: string;
    mp4?: string;
    mp4_size?: number;
    looping?: boolean;
    favorite: boolean;
    nsfw: boolean | null;
    vote: string | null;
    in_gallery: boolean;
};
export default function Config() {

    const [imgList, setImgList] = useState<ImgurImage[]>([])

    const fetchImgs = async () => {
        const imgList = await fetch("/api/listImages")

        if (imgList.ok) {
            const imgs = await imgList.json()
            console.log(imgs)
            setImgList(imgs.data)

        }
    }

    useEffect(() => {
        fetchImgs()
    }, [])

    return (
        <div className={styles.pages}>

            <Link href={"/"}>
                <button>Voltar</button></Link>
            <button
                onClick={() => fetchImgs()}
            >Get DATA</button>
            <div className={styles.container}>
                <h1>Configuração</h1>
                <div style={{
                    marginBlock: 40,
                    padding: 20,
                    border: '1px solid var(--gray-main)',
                    borderRadius: 10,
                }}>
                    <h4>Relatório do dia</h4>
                </div>
                <ul>
                    {imgList && imgList.length > 0 && imgList.map(img => {
                        // o retorno da api do datetime é em segundos
                        const dateTimeMiliseconds = img.datetime * 1000
                        const date = new Date(dateTimeMiliseconds)
                        return (
                            <li key={img.id}>
                                <Link style={{ color: 'blueviolet' }} target='_blank' href={img.link}>{img.link}</Link>
                                <p>Data do registro: {date.toLocaleString()}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div>
    )
}