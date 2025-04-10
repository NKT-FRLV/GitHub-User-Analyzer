import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import { verifyJWT } from '../../utils/auth';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthUser } from '@/app/types/github';

export async function POST(request: NextRequest) {
  try {
    console.log('Processing avatar update request');
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      console.log('Error: Token is missing');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userData = await verifyJWT(token);
    if (!userData) {
      console.log('Error: Invalid token');
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.log('User authenticated:', userData.id);
    
    const body = await request.json();
    const avatarUrl = body?.avatarUrl;
    
    console.log('Received avatar URL:', avatarUrl);
    
    if (!avatarUrl || typeof avatarUrl !== 'string') {
      console.log('Error: Invalid avatar URL');
      return NextResponse.json(
        { success: false, message: 'Avatar URL is missing or has an invalid format' },
        { status: 400 }
      );
    }
    
    // URL validation
    try {
      new URL(avatarUrl);
    } catch (e) {
      console.log('Error: Invalid URL');
      return NextResponse.json(
        { success: false, message: 'Invalid URL' },
        { status: 400 }
      );
    }
    
    try {
      console.log('Updating avatar for user with ID:', userData.id);
      
      // Update the user using raw SQL
      await prisma.$executeRaw`UPDATE "User" SET "avatarUrl" = ${avatarUrl} WHERE id = ${userData.id}`;
      
      // Get the updated user
      const updatedUser = await prisma.user.findUnique({
        where: { id: userData.id }
      });
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, message: 'Could not find user after update' },
          { status: 500 }
        );
      }
      
      // Explicitly get the avatar URL using raw SQL to ensure it's available
      const result = await prisma.$queryRaw<{avatarUrl: string | null}[]>`
        SELECT "avatarUrl" FROM "User" WHERE id = ${updatedUser.id}
      `;
      const updatedAvatarUrl = result && result.length > 0 ? result[0].avatarUrl : null;
      
      console.log('Updated user avatar:', updatedAvatarUrl);
      
      // Create user response object
      const userResponse: AuthUser = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedAvatarUrl || undefined,
        isAuthenticated: true
      };
      
      console.log('Sending response with updated user:', userResponse);
      
      return NextResponse.json({
        success: true,
        message: 'Avatar successfully updated',
        user: userResponse
      });
    } catch (dbError) {
      console.error('Database error updating avatar:', dbError);
      
      if (dbError instanceof PrismaClientKnownRequestError) {
        console.log('Prisma error:', dbError.message);
        return NextResponse.json(
          { success: false, message: `Database error: ${dbError.message}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: 'Database error while updating avatar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 