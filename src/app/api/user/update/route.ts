/**
 * User Profile Update API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { name, email } = await req.json();

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name || session.user.name,
                email: email || session.user.email,
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });

    } catch (error) {
        console.error('Error updating user:', error);

        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
