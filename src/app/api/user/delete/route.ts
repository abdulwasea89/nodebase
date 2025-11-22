/**
 * Delete User Account API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete all user data (cascade will handle related records)
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting user:', error);

        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
