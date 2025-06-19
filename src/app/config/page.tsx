'use client';

import styles from '@/app/page.module.css'
import MainButton from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
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
    const [dailyImagesCount, setDailyImagesCount] = useState(0)

    const pageSize = 10
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(imgList.length / pageSize)

    const [offset, setOffset] = useState(0)
    const [isLoadingData, setIsLoadingData] = useState(false)


    const calculateDailyImages = (images: ImgurImage[]): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        return images.filter(image => {
            const imageDate = new Date(image.datetime);
            imageDate.setHours(0, 0, 0, 0);
            return imageDate.getTime() >= today.getTime() && imageDate.getTime() <= endOfToday.getTime();
        })?.length || 0;
    }

    const fetchImgs = async () => {
        setIsLoadingData(true)

        try {
            const imgList = await fetch("/api/listImages")
            if (imgList.ok) {
                const imgs = await imgList.json()
                // como a response da api é em segundos ajusta para milisegundos
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
        return <LoadingSpinner />
    }
    return (
        <div className={styles.pages}>
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
                <ul style={{ height: '50vh' }}>
                    {imgList && imgList.length > 0 && imgList.slice(offset, offset + pageSize).map(img => {
                        // o retorno da api do datetime é em segundos
                        const date = new Date(img.datetime)
                        return (
                            <li key={img.id}>
                                <Link style={{ color: 'blueviolet' }} target='_blank' href={img.link}>{img.link}</Link>
                                <p>Data do registro: {date.toLocaleString()}</p>
                            </li>
                        )
                    })}
                </ul>
                <div className={styles.paginationControls} style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>Página {currentPage}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Próximo
                    </button>
                </div>
            </div>
            <MainButton label='Voltar' linkHref='/' />
        </div>
    )
}