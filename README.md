# 💡 Acessibilidade Interativa na Educação

Este repositório contém o código-fonte de uma aplicação educacional interativa voltada ao ensino dos princípios de **acessibilidade digital** baseados na WCAG (Web Content Accessibility Guidelines). Desenvolvida como parte da disciplina de Computação Aplicada à Educação, a plataforma foi construída com foco em **inclusão, usabilidade e acompanhamento pedagógico**.

## ✨ Funcionalidades

### 👩‍🎓 Estudante
- Acesso a módulos temáticos: **Perceptível**, **Operável**, **Compreensível** e **Robusto**
- Quiz interativo com:
  - Feedback imediato
  - Sistema de tentativas
  - Cronômetro e barra de progresso
- Conquistas (badges) desbloqueadas ao atingir 100% nos módulos
- Perfil com resumo de progresso

### 👩‍🏫 Professor
- Dashboard com visão geral da turma
  - Progresso percentual por aluno
  - Módulos concluídos
  - Conquistas obtidas
  - Última atividade registrada
- Gráficos interativos (Recharts)
- Exportação de dados para CSV
- Edição inline de perguntas e alternativas

## 📦 Tecnologias Utilizadas

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL + Prisma ORM
- **Gráficos:** Recharts
- **Persistência Local (Progresso):** LocalStorage
- **Estilização acessível:** Foco em contrastes, responsividade e navegação via teclado

## 📚 Estrutura do Projeto

```
/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   └── routes/
├── public/
├── backend/
│   ├── prisma/
│   └── index.js
├── README.md
└── package.json
```

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js
- PostgreSQL (ou SQLite para testes locais)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/AnaFerreira015/gamified-wcag-accessibility.git
cd gamified-wcag-accessibility
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados no arquivo `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

4. Rode as migrações:
```bash
npx prisma migrate dev --name init
```

5. Inicie o backend:
```bash
cd backend
npx ts-node index.ts
```

6. Inicie o frontend:
```bash
cd frontend
npm run dev
```

## 🔒 Acessibilidade

Este projeto segue princípios da WCAG 2.1, com foco em:
- Contraste de cores adequado
- Feedback textual e visual
- Compatibilidade com leitores de tela
- Uso de semântica HTML apropriada

## 📸 Capturas de Tela

### 🧠 Quiz Interativo (estudante)
![Quiz perceptível respondido](src/assets/quiz-perceptible.png)
*Interface do quiz com tempo e tentativas visíveis, apresentando uma pergunta sobre contraste de cores.*

---

### 🛠️ Edição de Perguntas (professor)
![Edição de pergunta e alternativas](src/assets/quiz-perceptible-editar-professor.png)
*Modo de edição inline no qual o professor pode alterar o enunciado e as alternativas da pergunta.*

---

### 📊 Dashboard do Professor
![Dashboard do professor](src/assets/dashboard-professor.png)
*Resumo visual da turma, com gráfico de progresso, lista de alunos e exportação de dados.*

---

### 🧍‍♀️ Dashboard do Aluno
![Dashboard do aluno](src/assets/dashboard-aluno.png)
*Visão individual do progresso do estudante, incluindo módulos completados e conquistas.*

---

### 🙋 Perfil do Aluno
![Perfil do aluno](src/assets/perfil-aluno.png)
*Perfil com progresso geral e conquistas desbloqueadas, exibidas com ícones e cores temáticas.*

---

### 👩‍🏫 Perfil do Professor
![Perfil do professor](src/assets/perfil-professor.png)
*Resumo da turma no perfil do professor, incluindo estatísticas de progresso e link para o dashboard.*

## 📄 Licença

Este projeto é de uso educacional, sem fins lucrativos. Pode ser adaptado e reutilizado com atribuição. Licenciado sob [MIT License](LICENSE).
