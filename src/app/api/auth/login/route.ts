import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { login, password } = await req.json();

        const errors: Record<string, string> = {};

        if (!login) errors.login = 'Введите логин';
        if (!password) errors.password = 'Введите пароль';

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { login } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                { errors: { login: 'Неверный логин или пароль' } },
                { status: 401 }
            );
        }

        const token = await createToken(user.id, user.role);
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
