import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '../utils/auth';
import { saveCandidate, getCandidates, deleteCandidate } from '../utils/candidate';

// GET - получить список сохраненных кандидатов
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const candidates = await getCandidates(userData.id);
    
    return NextResponse.json({ success: true, candidates });
  } catch (error) {
    console.error('Error getting candidates:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - сохранить кандидата
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }
    
    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { githubName, githubUrl, avatarUrl, reposUrl } = await request.json();
    
    if (!githubName || !githubUrl || !avatarUrl || !reposUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = await saveCandidate(githubName, githubUrl, avatarUrl, reposUrl, userData.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to save candidate' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Candidate saved successfully'
    });
  } catch (error) {
    console.error('Error saving candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - удалить кандидата
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }
    
    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { candidateId } = await request.json();
    
    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: 'Candidate ID not specified' },
        { status: 400 }
      );
    }
    
    const success = await deleteCandidate(candidateId, userData.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete candidate' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 