import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedBadges() {
  const badges = [
    {
      badgeId: 'a_perceptible',
      title: 'Mestre da Percepção',
      description: 'Acertou todas as perguntas do módulo Perceptível.',
    },
    {
      badgeId: 'a_operable',
      title: 'Controlador Operável',
      description: 'Acertou todas as perguntas do módulo Operável.',
    },
    {
      badgeId: 'a_understandable',
      title: 'Sábio da Compreensão',
      description: 'Acertou todas as perguntas do módulo Compreensível.',
    },
    {
      badgeId: 'a_robust',
      title: 'Engenheiro Robusto',
      description: 'Acertou todas as perguntas do módulo Robusto.',
    },
  ];

  for (const badge of badges) {
    const exists = await prisma.studentAchievement.findFirst({
      where: { badgeId: badge.badgeId },
    });

    if (!exists) {
      await prisma.studentAchievement.create({
        data: {
          badgeId: badge.badgeId,
          student: { create: { name: 'Placeholder', email: `${badge.badgeId}@demo.com`, password: 'temp', role: 'student' } },
        },
      });
      console.log(`🎖️ Badge criado com dummy user: ${badge.badgeId}`);
    } else {
      console.log(`✅ Badge já existe: ${badge.badgeId}`);
    }
  }
}

async function seedQuestions() {
  const questions = [
    // Perceptible
    {
      module: 'perceptible',
      text: 'O que garante que o conteúdo seja perceptível para pessoas com deficiência visual?',
      options: JSON.stringify(['Uso de animações', 'Texto com cores vibrantes', 'Texto alternativo em imagens', 'Fonte cursiva']),
      correctIndex: 2,
    },
    {
      module: 'perceptible',
      text: 'Por que o contraste de cor é importante?',
      options: JSON.stringify(['Para estética', 'Para economizar energia', 'Para legibilidade por pessoas com baixa visão', 'Para combinar com a marca']),
      correctIndex: 2,
    },
    {
      module: 'perceptible',
      text: 'Qual elemento ajuda usuários com deficiência auditiva?',
      options: JSON.stringify(['Vídeos automáticos', 'Texto alternativo', 'Legendas em vídeos', 'Animações com som']),
      correctIndex: 2,
    },
    {
      module: 'perceptible',
      text: 'Qual prática melhora a acessibilidade de conteúdo multimídia?',
      options: JSON.stringify(['Remover controles', 'Adicionar descrições de áudio', 'Usar som alto', 'Evitar pausas']),
      correctIndex: 1,
    },

    // Operable
    {
      module: 'operable',
      text: 'O que melhora a operabilidade com teclado?',
      options: JSON.stringify(['Menus ocultos', 'Focus visível nos elementos interativos', 'Uso exclusivo de mouse', 'Elementos animados']),
      correctIndex: 1,
    },
    {
      module: 'operable',
      text: 'Por que evitar conteúdo piscando rapidamente?',
      options: JSON.stringify(['Consome bateria', 'Pode causar ataques epilépticos', 'É feio', 'É lento']),
      correctIndex: 1,
    },
    {
      module: 'operable',
      text: 'Qual item deve ser operável sem uso de mouse?',
      options: JSON.stringify(['Botões', 'Imagens decorativas', 'Vídeos externos', 'Títulos']),
      correctIndex: 0,
    },
    {
      module: 'operable',
      text: 'Qual prática é recomendada para navegação por teclado?',
      options: JSON.stringify(['Ignorar formulários', 'Pular menus', 'Oferecer atalho para conteúdo principal', 'Desativar o TAB']),
      correctIndex: 2,
    },

    // Understandable
    {
      module: 'understandable',
      text: 'O que melhora a compreensão do conteúdo?',
      options: JSON.stringify(['Uso de jargões técnicos', 'Organização clara e linguagem simples', 'Textos longos sem divisão', 'Imagens sem contexto']),
      correctIndex: 1,
    },
    {
      module: 'understandable',
      text: 'Qual é um bom exemplo de linguagem compreensível?',
      options: JSON.stringify(['Parágrafos longos e complexos', 'Ícones sem rótulo', 'Instruções claras e objetivas', 'Siglas não explicadas']),
      correctIndex: 2,
    },
    {
      module: 'understandable',
      text: 'O que deve ser informado ao usuário?',
      options: JSON.stringify(['Erro no formulário com instrução de correção', 'Mensagem genérica de erro', 'Nada, para não confundir', 'Redirecionar sem aviso']),
      correctIndex: 0,
    },
    {
      module: 'understandable',
      text: 'Como garantir previsibilidade na navegação?',
      options: JSON.stringify(['Mudar o comportamento dos links aleatoriamente', 'Evitar feedbacks', 'Manter padrões consistentes entre páginas', 'Carregar múltiplos conteúdos simultaneamente']),
      correctIndex: 2,
    },

    // Robust
    {
      module: 'robust',
      text: 'O que significa tornar um site robusto?',
      options: JSON.stringify(['Ter muitos efeitos', 'Funcionar em tecnologias assistivas diversas', 'Exigir navegador específico', 'Ser bonito em resoluções altas']),
      correctIndex: 1,
    },
    {
      module: 'robust',
      text: 'Por que usar HTML semântico?',
      options: JSON.stringify(['É mais bonito', 'Facilita SEO apenas', 'Ajuda leitores de tela a interpretar a página', 'Evita bugs visuais']),
      correctIndex: 2,
    },
    {
      module: 'robust',
      text: 'Qual prática é considerada robusta?',
      options: JSON.stringify(['Usar divs para tudo', 'Evitar ARIA', 'Usar roles e atributos ARIA corretamente', 'Ignorar validação de acessibilidade']),
      correctIndex: 2,
    },
    {
      module: 'robust',
      text: 'Como garantir compatibilidade com leitores de tela?',
      options: JSON.stringify(['Evitar headers', 'Usar marcação adequada e rótulos descritivos', 'Exigir mouse', 'Remover foco de elementos']),
      correctIndex: 1,
    },
  ];

  for (const question of questions) {
    const exists = await prisma.question.findFirst({
      where: { text: question.text },
    });

    if (!exists) {
      await prisma.question.create({ data: question });
      console.log(`✅ Pergunta adicionada: ${question.text}`);
    } else {
      console.log(`🟡 Já existe: ${question.text}`);
    }
  }
}

async function seedDemoStudent() {
  const email = 'demo@student.com';
  const exists = await prisma.student.findUnique({ where: { email } });

  if (!exists) {
    const student = await prisma.student.create({
      data: {
        name: 'Aluno Demo',
        email,
        password: '123456', 
        role: 'student',
        progress: {
          create: {
            perceptible: 0,
            operable: 0,
            understandable: 0,
            robust: 0,
          },
        },
      },
    });
    console.log(`👤 Estudante criado: ${student.email}`);
  } else {
    console.log(`✅ Estudante demo já existe: ${email}`);
  }
}

async function main() {
  await seedBadges();
  await seedQuestions();
  await seedDemoStudent();
}

main()
  .then(() => {
    console.log('🎉 Seed finalizado com sucesso');
  })
  .catch((e) => {
    console.error('Erro no seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
