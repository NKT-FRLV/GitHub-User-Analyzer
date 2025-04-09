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
        { success: false, message: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Недействительный токен' },
        { status: 401 }
      );
    }

    const candidates = await getCandidates(userData.id);
    
    return NextResponse.json({ success: true, candidates });
  } catch (error) {
    console.error('Error getting candidates:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
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
        { success: false, message: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Недействительный токен' },
        { status: 401 }
      );
    }
    
    const { githubName, githubUrl, avatarUrl } = await request.json();
    
    if (!githubName || !githubUrl || !avatarUrl) {
      return NextResponse.json(
        { success: false, message: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }
    
    const success = await saveCandidate(githubName, githubUrl, avatarUrl, userData.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Не удалось сохранить кандидата' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Кандидат успешно сохранен'
    });
  } catch (error) {
    console.error('Error saving candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
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
        { success: false, message: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Недействительный токен' },
        { status: 401 }
      );
    }
    
    const { candidateId } = await request.json();
    
    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: 'ID кандидата не указан' },
        { status: 400 }
      );
    }
    
    const success = await deleteCandidate(candidateId, userData.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Не удалось удалить кандидата' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Кандидат успешно удален'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 