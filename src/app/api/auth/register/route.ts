import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const cyrillicRegex = /^[а-яА-ЯёЁ\s]+$/;
const latinDashRegex = /^[a-zA-Z\-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullname, login, email, password, passwordRepeat, agree } = body;

        const errors: Record<string, string> = {};

        if (!fullname || !cyrillicRegex.test(fullname)) {
            errors.fullname = 'Только кириллические буквы и пробелы';
        }
        if (!login || !latinDashRegex.test(login)) {
            errors.login = 'Только латиница и дефис';
        }
        if (!email || !emailRegex.test(email)) {
            errors.email = 'Некорректный email';
        }
        if (!password) {
            errors.password = 'Пароль обязателен';
        }
        if (password !== passwordRepeat) {
            errors.passwordRepeat = 'Пароли не совпадают';
        }
        if (!agree) {
            errors.agree = 'Необходимо согласие на обработку персональных данных';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { login } });
        if (existingUser) {
            return NextResponse.json(
                { errors: { login: 'Логин уже занят' } },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                fullname,
                login,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });

        const token = await createToken(user.id, user.role);
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
