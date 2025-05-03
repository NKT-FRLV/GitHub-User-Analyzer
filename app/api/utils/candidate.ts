import { prisma } from '@/app/lib/prisma';

/**
 * Сохраняет GitHub-пользователя как кандидата
 * @param githubName - имя пользователя GitHub
 * @param githubUrl - URL профиля на GitHub
 * @param avatarUrl - URL аватара пользователя
 * @param userId - ID авторизованного пользователя
 * @returns true, если сохранение прошло успешно
 */
export async function saveCandidate(
  githubName: string,
  githubUrl: string,
  avatarUrl: string,
  reposUrl: string,
  userId: string
): Promise<boolean> {
  try {
    // Проверяем, существует ли уже этот кандидат у данного пользователя
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        githubName_userId: {
          githubName,
          userId
        }
      }
    });

    // Если кандидат уже существует, обновляем данные
    if (existingCandidate) {
      await prisma.candidate.update({
        where: {
          id: existingCandidate.id
        },
        data: {
          githubUrl,
          avatarUrl,
          reposUrl,
          savedAt: new Date() // Обновляем время сохранения
        }
      });
      return true;
    }

    // Создаем нового кандидата
    await prisma.candidate.create({
      data: {
        githubName,
        githubUrl,
        avatarUrl,
        reposUrl,
        userId
      }
    });

    return true;
  } catch (error) {
    console.error('Error saving candidate:', error);
    return false;
  }
}

/**
 * Получает список всех кандидатов пользователя
 * @param userId - ID авторизованного пользователя
 * @returns массив кандидатов
 */
export async function getCandidates(userId: string) {
  try {
    return await prisma.candidate.findMany({
      where: {
        userId
      },
      orderBy: {
        savedAt: 'desc' // От новых к старым
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

/**
 * Удаляет кандидата из списка сохраненных
 * @param candidateId - ID кандидата
 * @param userId - ID авторизованного пользователя
  * @returns true, если удаление прошло успешно
 */
export async function deleteCandidate(candidateId: string, userId: string): Promise<boolean> {
  try {
    // Проверяем, что кандидат принадлежит этому пользователю
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        userId
      }
    });

    if (!candidate) {
      return false;
    }

    await prisma.candidate.delete({
      where: {
        id: candidateId
      }
    });

    return true;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return false;
  }
} 