# JPlaneja - Sistema de Gestão para Móveis Planejados

Sistema completo para gestão de loja de móveis planejados, incluindo controle de estoque, orçamentos, clientes, vendas e muito mais.

## Funcionalidades

- 📦 Controle de estoque (chapas, ferragens e acabamentos)
- 💰 Criação de orçamentos com envio por PDF/WhatsApp
- 👥 Cadastro de clientes com histórico
- 💳 Gestão de vendas e pagamentos
- 📊 Relatórios e gráficos
- 📱 Acesso mobile
- 🔒 Sistema de login seguro
- 🛠️ Painel de produção/montagem
- 🖼️ Galeria de projetos

## Requisitos

- Node.js 18+
- MongoDB
- NPM ou Yarn

## Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/jplaneja.git
cd jplaneja
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
- Crie um arquivo .env na raiz do projeto
- Adicione as seguintes variáveis:
\`\`\`
DATABASE_URL="mongodb://localhost:27017/jplaneja"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
\`\`\`

4. Execute as migrações do banco de dados:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em http://localhost:3000

## Estrutura do Projeto

- `/src/app` - Páginas e rotas da aplicação
- `/src/components` - Componentes React reutilizáveis
- `/src/lib` - Utilitários e configurações
- `/prisma` - Schema e migrações do banco de dados
- `/public` - Arquivos estáticos

## Tecnologias Utilizadas

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- MongoDB
- NextAuth.js
- React Hook Form
- Zod
- Chart.js

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/nova-feature\`)
3. Faça commit das suas alterações (\`git commit -am 'Adiciona nova feature'\`)
4. Faça push para a branch (\`git push origin feature/nova-feature\`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 