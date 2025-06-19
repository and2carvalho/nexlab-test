import { generateQrCodeUrl } from "@/utils";
import { NextResponse } from "next/server";
import { uuid } from "uuidv4";

export async function POST(request: Request) {
    try {
        const { imageData }: { imageData: string } = await request.json();

        if (!imageData) {
            return NextResponse.json({ message: 'No image data provided' }, { status: 400 });
        }

        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return NextResponse.json({ message: 'Invalid Data URL format' }, { status: 400 });
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const extension = mimeType.split("/")[1] || 'png';
        const filename = `${uuid()}.${extension}`

    
        const accessToken = process.env.IMGUR_ACCESS_TOKEN
        const defaultAlbumId = process.env.IMGUR_DEFAULT_ALBUM_ID

        const formData = new FormData()
        formData.append('image', base64Data)
        formData.append('type', 'base64')
        formData.append('name', filename)
        formData.append('album', defaultAlbumId!)


        const url = "https://api.imgur.com/3/image"
        const postReq = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData
        })

        if (!postReq.ok) {
            return NextResponse.json({ message: 'Error uploading image' }, { status: postReq.status || 500 })
        }

        const uploaded = await postReq.json()
        const imgQrCode = await generateQrCodeUrl(uploaded.data.link)

        return NextResponse.json({ message: 'Image salva com sucesso', imgQrCode }, { status: 200 });


    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}