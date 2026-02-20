import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const requestId = Number(id);
        const existingReq = await prisma.request.findUnique({ where: { id: requestId } });

        if (!existingReq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existingReq.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        if (existingReq.status !== 'Новая') return NextResponse.json({ error: 'Удалять можно только новые заявки' }, { status: 400 });

        await prisma.request.delete({ where: { id: requestId } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromCookies();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await params;
        const requestId = Number(id);
        const formData = await req.formData();
        const status = formData.get('status') as string;

        if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

        const existingReq = await prisma.request.findUnique({ where: { id: requestId } });
        if (!existingReq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existingReq.status === 'Услуга оказана') return NextResponse.json({ error: 'Смена статуса "Услуга оказана" невозможна' }, { status: 400 });

        let updateData: any = { status };

        // If moving to 'Услуга оказана', requires afterPhoto
        if (status === 'Услуга оказана') {
            const photo = formData.get('photo') as File;
            if (!photo) return NextResponse.json({ error: 'Требуется фото для завершения' }, { status: 400 });
            if (!['image/jpeg', 'image/bmp'].includes(photo.type)) {
                return NextResponse.json({ error: 'Разрешены только jpeg и bmp' }, { status: 400 });
            }
            if (photo.size > 2 * 1024 * 1024) {
                return NextResponse.json({ error: 'Максимальный размер 2Мб' }, { status: 400 });
            }

            const buffer = Buffer.from(await photo.arrayBuffer());
            const ext = photo.type === 'image/jpeg' ? '.jpg' : '.bmp';
            const filename = crypto.randomUUID() + ext;
            const filepath = path.join(process.cwd(), 'public/uploads', filename);
            await writeFile(filepath, buffer);

            updateData.afterPhoto = `/uploads/${filename}`;
        }

        const updated = await prisma.request.update({
            where: { id: requestId },
            data: updateData,
        });

        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
