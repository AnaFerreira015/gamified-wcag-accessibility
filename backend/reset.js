import { execSync } from 'child_process';

try {
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  console.log('\n✅ Banco de dados resetado com sucesso!');
} catch (error) {
  console.error('Erro ao resetar o banco:', error);
}
