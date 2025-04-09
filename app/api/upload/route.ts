import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { verifyJWT } from '../utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
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
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверка типа файла (разрешаем только изображения)
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Загружать можно только изображения' },
        { status: 400 }
      );
    }

    // Создаем уникальное имя файла
    const fileName = `${userData.id}-${uuidv4()}${getFileExtension(file.name)}`;
    
    // Путь для сохранения
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);
    
    // Преобразуем файл в буфер
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Записываем файл на сервер
    await writeFile(filePath, buffer);
    
    // Возвращаем URL файла
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      fileUrl,
      message: 'Файл успешно загружен'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}

// Получение расширения файла
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length === 1) return '';
  return `.${parts[parts.length - 1].toLowerCase()}`;
} 