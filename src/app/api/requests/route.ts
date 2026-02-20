import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter'); // "finished"

        // If home page needs finished requests, anyone can view
        // The requirements say "Главная страница выводит не более 4 последних заявок в статусе 'Услуга оказана'"
        if (filter === 'finished') {
            const requests = await prisma.request.findMany({
                where: { status: 'Услуга оказана' },
                orderBy: { createdAt: 'desc' },
                take: 4,
            });
            return NextResponse.json(requests);
        }

        const user = await getUserFromCookies();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (user.role === 'ADMIN') {
            const requests = await prisma.request.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json(requests);
        } else {
            const requests = await prisma.request.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json(requests);
        }
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const petName = formData.get('petName') as string;
        const photo = formData.get('photo') as File;

        if (!petName || !photo) {
            return NextResponse.json({ error: 'Обязательные поля не заполнены' }, { status: 400 });
        }

        // validate photo type and size
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

        const newReq = await prisma.request.create({
            data: {
                petName,
                beforePhoto: `/uploads/${filename}`,
                userId: user.id,
                // status is "Новая" by default in schema
            },
        });

        return NextResponse.json(newReq, { status: 201 });
    } catch (err) {
        console.error('Create request error', err);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}
