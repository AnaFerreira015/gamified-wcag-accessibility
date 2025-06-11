import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/students', async (req, res) => {
  const students = await prisma.student.findMany({
    include: { progress: true },
  });
  res.json(students);
});

app.post('/students', async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'E-mail já cadastrado' });

  const hashedPassword = await bcrypt.hash(password, 10); 

  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: hashedPassword, 
      role,
      progress: {
        create: { perceptible: 0, operable: 0, understandable: 0, robust: 0 },
      },
    },
  });

  res.json({
    id: student.id,
    name: student.name,
    email: student.email,
    role: student.role,
  });
});

app.get('/students/:id/progress', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const progress = await prisma.progress.findUnique({
      where: { studentId: id },
    });
    if (!progress) return res.status(404).json({ error: 'Progresso não encontrado' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

app.put('/students/:id/progress', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.progress.update({
      where: { studentId: Number(id) },
      data,
    });
    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro ao atualizar progresso' });
  }
});

app.get('/students/:id/achievements', async (req, res) => {
  try {
    const achievements = await prisma.studentAchievement.findMany({
      where: { studentId: Number(req.params.id) },
    });
    const ids = achievements.map((a) => a.badgeId);
    res.json(ids);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar conquistas' });
  }
});

app.put('/students/:id/achievements', async (req, res) => {
  try {
    await prisma.studentAchievement.create({
      data: {
        studentId: Number(req.params.id),
        badgeId: req.body.achievementId
      }
    });
    res.status(200).json({ message: 'Conquista adicionada' });
  } catch (err) {
    console.error('Erro ao adicionar conquista:', err);
    res.status(500).json({ error: 'Erro ao adicionar conquista' });
  }
});

app.get('/achievements', async (req, res) => {
  const badges = [
    {
      id: 'a_perceptible',
      title: 'Perceptível completo',
      description: 'Você completou 100% do módulo Perceptível!',
    },
    {
      id: 'a_operable',
      title: 'Operável completo',
      description: 'Você completou 100% do módulo Operável!',
    },
    {
      id: 'a_understandable',
      title: 'Compreensível completo',
      description: 'Você completou 100% do módulo Compreensível!',
    },
    {
      id: 'a_robust',
      title: 'Robusto completo',
      description: 'Você completou 100% do módulo Robusto!',
    },
  ];
  res.json(badges);
});

app.get('/teacher/overview', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { role: 'student' },
      include: {
        progress: true,
        achievements: true,
        responses: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
      },
    });

    const result = students.map((s) => {
      const p = s.progress;
      const percent = p
        ? Math.round((p.perceptible + p.operable + p.understandable + p.robust) / 4)
        : 0;

      const modules = [p?.perceptible, p?.operable, p?.understandable, p?.robust];
      const completedModules = modules.filter(val => typeof val === 'number' && val === 100).length;

      const lastActivity = s.responses[0]?.timestamp || null;

      return {
        id: s.id,
        name: s.name,
        percent,
        completedModules,
        achievements: s.achievements?.map(a => a.badgeId) || [],
        lastActivity,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Erro ao gerar overview do professor:', err);
    res.status(500).json({ error: 'Erro ao obter dados da turma' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.student.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Senha incorreta' });
  }

  res.json({
    id: user.id,
    name: user.name,         
    email: user.email,
    role: user.role,
  });
});

app.get('/questions/:module', async (req, res) => {
  const { module } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { module },
    });

    const parsed = questions.map(q => ({
      id: q.id,
      module: q.module,
      text: q.text,
      options: JSON.parse(q.options),
      correctIndex: q.correctIndex
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perguntas' });
  }
});

app.put('/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { text, options } = req.body;

  try {
    const updated = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        text,
        options: JSON.stringify(options), 
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar pergunta' });
  }
});

app.post('/quiz/answer', async (req, res) => {
  const { studentId, questionId, isCorrect } = req.body;
  try {
    const history = await prisma.responseHistory.create({
      data: { studentId, questionId, isCorrect }
    });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar resposta' });
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const data = { name, email };
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      data.password = hashed;
    }

    const updated = await prisma.student.update({
      where: { id: Number(id) },
      data,
    });

    res.json({ id: updated.id, name: updated.name, email: updated.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

app.listen(3000, () => {
  console.log('API running at http://localhost:3000');
});
