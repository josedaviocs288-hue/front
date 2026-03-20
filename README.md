# Recicle – Frontend

Front-end da plataforma **Recicle**, um sistema para conectar cidadãos a pontos de coleta seletiva e promover a reciclagem.

## 🗂️ Estrutura do projeto

```
front/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos da aplicação
├── js/
│   └── main.js         # Interatividade (menu mobile, busca, formulário)
└── README.md
```

## 🚀 Como rodar

Não há dependências de build. Basta abrir o arquivo `index.html` em um navegador moderno, ou servir a pasta com qualquer servidor HTTP estático, por exemplo:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Depois acesse `http://localhost:8080`.

## ✨ Funcionalidades

| Seção | Descrição |
|---|---|
| **Hero** | Apresentação do projeto com call-to-actions |
| **Sobre** | Benefícios da reciclagem |
| **Como Funciona** | Guia de 3 passos |
| **Materiais** | Cores de coleta seletiva por material |
| **Pontos de Coleta** | Listagem e busca por texto |
| **Contato** | Formulário com validação client-side |

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox, responsivo)
- JavaScript (ES5-compatível, sem dependências externas)

## 📦 Deploy

```bash
git remote add origin https://github.com/SEU-USUARIO/frontend-recicle.git
git branch -M main
git push -u origin main
```
