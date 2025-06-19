import { NextResponse } from "next/server";

export async function GET(request: Request) {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {

        const accessToken = process.env.IMGUR_ACCESS_TOKEN
        const defaultAlbumId = process.env.IMGUR_DEFAULT_ALBUM_ID


        const url = `https://api.imgur.com/3/album/${defaultAlbumId}/images`
        const getReq = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!getReq.ok) {
            return NextResponse.json({ message: 'Error buscando images.' }, { status: getReq.status || 500 })
        }

        const imgList = await getReq.json()

        return NextResponse.json({ data: imgList.data }, { status: 200 });


    } catch (error) {
        console.error('Error getting image list:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}