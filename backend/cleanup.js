import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const emails = [
    'a_perceptible@demo.com',
    'a_operable@demo.com',
    'a_understandable@demo.com',
    'a_robust@demo.com',
    'demo@student.com'
  ];

  const students = await prisma.student.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });

  const studentIds = students.map(s => s.id);

  if (studentIds.length === 0) {
    console.log('Nenhum usuário inválido encontrado.');
    return;
  }

  await prisma.responseHistory.deleteMany({
    where: { studentId: { in: studentIds } },
  });

  await prisma.studentAchievement.deleteMany({
    where: { studentId: { in: studentIds } },
  });

  await prisma.progress.deleteMany({
    where: { studentId: { in: studentIds } },
  });

  const deleted = await prisma.student.deleteMany({
    where: { id: { in: studentIds } },
  });

  console.log(`✅ Removidos ${deleted.count} usuários inválidos`);
}

main()
  .catch((e) => {
    console.error('Erro ao limpar:', e);
  })
  .finally(() => prisma.$disconnect());
