import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

export async function createToken(userId: number, role: string) {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    } catch (error) {
        return null;
    }
}

export async function getUserFromCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, login: true, role: true, fullname: true },
    });

    return user;
}
