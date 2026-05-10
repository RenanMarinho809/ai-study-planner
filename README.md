<div align="center">
 
  <h1>AI Study Planner 🧠📚</h1>
  <p>Uma plataforma inteligente para geração de planos de estudo personalizados utilizando Inteligência Artificial.</p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<br />

## 🎯 Sobre o Projeto

O **AI Study Planner** é uma aplicação web focada em otimizar o tempo e o aprendizado de estudantes. A plataforma utiliza Inteligência Artificial (Groq / OpenAI) para criar roteiros de estudos totalmente personalizados com base nos objetivos, nível de conhecimento e disponibilidade de tempo do usuário.

Este projeto foi desenvolvido com foco em oferecer uma **experiência de usuário (UX) excepcional**, interfaces limpas e responsivas, e código manutenível e escalável — características fundamentais para aplicações modernas.

---

## 👁️‍🗨️ Para Recrutadores: O que observar neste projeto?

Como desenvolvedor Front-end, construí este projeto para demonstrar na prática minhas habilidades técnicas e arquiteturais:

- **Componentização e Reusabilidade:** Uso intensivo de padrões de design do React, com componentes reutilizáveis baseados no **Shadcn UI** e **Radix UI**, garantindo consistência visual e acessibilidade.
- **Ecossistema Moderno:** Utilização das versões mais recentes do **Next.js (App Router)** e **React 19**, explorando renderização no servidor (SSR) e client components de forma otimizada.
- **Gerenciamento de Estado e Formulários:** Uso eficiente de Context API, aliado a **React Hook Form** e **Zod** para validação robusta de dados de entrada do usuário.
- **Integração com IA e Backend:** Comunicação com rotas de API (Next.js API Routes) para integração segura com serviços de LLM e persistência de dados no **MongoDB (Mongoose)**.
- **Design Responsivo e UI/UX:** Interface fluida construída com **Tailwind CSS v4**, suportando temas (Dark/Light mode) e adaptando-se perfeitamente a dispositivos móveis e desktops.

---

## ✨ Principais Funcionalidades

- **🧠 Geração de Planos com IA:** Algoritmo que consome LLMs para fragmentar grandes objetivos de estudo em tarefas diárias gerenciáveis.
- **📅 Calendário Interativo:** Interface visual rica para acompanhamento do cronograma e gerenciamento de atividades.
- **📊 Dashboard de Progresso:** Acompanhamento de métricas de estudo, *streaks* (ofensivas) e gráficos (utilizando Recharts).
- **🔐 Autenticação e Fluxo de Usuário:** Telas de Login, Registro e Setup inicial (Onboarding).
- **🌗 Tema Dark/Light:** Suporte nativo a temas utilizando `next-themes`.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- **[Next.js 16](https://nextjs.org/)** (App Router)
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Shadcn UI](https://ui.shadcn.com/)** & **Radix UI** (Componentes Acessíveis)
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** (Validação)
- **[Recharts](https://recharts.org/)** (Visualização de Dados)
- **[Lucide React](https://lucide.dev/)** (Ícones)

### Back-end & Infraestrutura
- **Next.js API Routes**
- **[MongoDB](https://www.mongodb.com/)** com **Mongoose** (Banco de Dados)
- **[Groq SDK](https://wow.groq.com/)** / **[OpenAI](https://openai.com/)** (Inteligência Artificial)

---

## 📁 Arquitetura do Projeto

O projeto segue uma estrutura modular, visando a separação de responsabilidades:

```bash
📦 ai-study-planner
 ┣ 📂 app              # Rotas da aplicação (Next.js App Router) e API Routes
 ┣ 📂 components       # Componentes React (divididos em UI genérica e escopo de negócio)
 ┣ 📂 hooks            # Custom Hooks (ex: use-mobile, use-toast)
 ┣ 📂 lib              # Funções utilitárias, Contextos, Setup do MongoDB e Types
 ┣ 📂 models           # Schemas do Mongoose (User, StudyPlan)
 ┗ 📂 styles           # Arquivos de estilização global (Globals.css)
```

---

## 🚀 Como executar localmente

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/ai-study-planner.git
```

2. **Acesse a pasta do projeto:**
```bash
cd ai-study-planner
```

3. **Instale as dependências:**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

4. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env.local` na raiz do projeto e adicione as chaves necessárias (exemplo):
```env
MONGODB_URI=sua_connection_string_do_mongodb
GROQ_API_KEY=sua_chave_de_api_do_groq
# ou
OPENAI_API_KEY=sua_chave_de_api_da_openai
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

6. **Acesse a aplicação:**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📬 Contato

Gostou do projeto ou quer bater um papo sobre Front-end e tecnologia? Me chame no LinkedIn!

- **LinkedIn:** [Seu Nome](https://linkedin.com/in/seu-perfil)
- **E-mail:** [seu-email@exemplo.com](mailto:seu-email@exemplo.com)
- **Portfólio:** [seusite.com](https://seusite.com)

<br/>

<div align="center">
  Feito com 💙 por um desenvolvedor apaixonado por criar experiências incríveis na web.
</div>
