'use client';

import styles from '@/app/page.module.css'
import MainButton from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InAppHeader from '@/components/InAppHeader';
import { calculateDailyImages } from '@/utils';

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
    const [dailyImagesCount, setDailyImagesCount] = useState(0)

    const pageSize = 10
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(imgList.length / pageSize)

    const [offset, setOffset] = useState(0)
    const [isLoadingData, setIsLoadingData] = useState(false)

    const fetchImgs = async () => {
        setIsLoadingData(true)

        try {
            const imgList = await fetch("/api/listImages")
            if (imgList.ok) {
                const imgs = await imgList.json()
                const result = imgs.data.map((el: ImgurImage) => ({
                    ...el,
                    datetime: el.datetime * 1000
                }))

                const dailyImg = calculateDailyImages(result)
                setDailyImagesCount(dailyImg)
                setImgList(result)
            }
            setIsLoadingData(false)
        } catch (e) {
            console.log(e)
            setIsLoadingData(false)
        }
    }

    useEffect(() => {
        fetchImgs()
    }, [])

    const handlePrevPage = () => {
        setOffset(offset - pageSize);
        setCurrentPage(currentPage - 1)
    };
    const handleNextPage = () => {
        setOffset(offset + pageSize);
        setCurrentPage(currentPage + 1)
    };

    if (isLoadingData) {
        return (
            <div className={styles.page}>
                <LoadingSpinner />
            </div>
        )
    }
    return (
        <div className={styles.page}>
            
            <InAppHeader />
            
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1>Configuração</h1>
                    <div style={{
                        marginBlock: 40,
                        padding: 20,
                        border: '1px solid var(--gray-main)',
                        borderRadius: 10,
                        textAlign: 'center'
                    }}>
                        <h4>Relatório</h4>
                        <p>Total de imagens do dia: {dailyImagesCount}</p>
                    </div>
                    <ul className={styles.configList}>
                        {imgList && imgList.length > 0 ? imgList.slice(offset, offset + pageSize).map(img => {
                            const date = new Date(img.datetime)
                            return (
                                <li key={img.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px dashed var(--gray-main)' }}>
                                    <Link style={{ color: 'blueviolet', wordBreak: 'break-all' }} target='_blank' href={img.link}>{img.link}</Link>
                                    <p>Data do registro: {date.toLocaleString('pt-BR')}</p>
                                </li>
                            )
                        }) : <p>Nenhuma imagem encontrada.</p>}
                    </ul>
                    <div className={styles.paginationControls}>
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages || 1}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages || imgList.length === 0}>
                            Próximo
                        </button>
                    </div>
                </div>
            </main>

            <div className={styles.inAppFooter}>
                <MainButton label='Voltar' linkHref='/' />
            </div>
        </div>
    )
}