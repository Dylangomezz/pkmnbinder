# 📱 PKMN Binder — Gerenciador de Coleções Pokémon TCG

<div align="center">
  <img src="./public/logo-binder.png" alt="PKMN Binder Logo" width="120" style="border-radius: 12px; filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.5));" />
  <p><strong>Fichário Virtual Premium e Analítico para Colecionadores de Pokémon TCG</strong></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="ChartJS" />
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=GitHub&logoColor=white" alt="GitHub Pages" />
</div>

---

## 🌐 Demonstração ao Vivo

A aplicação encontra-se publicada e totalmente funcional na Web através do GitHub Pages:
👉 **[Aceder ao PKMN Binder](https://dylangomezz.github.io/pkmnbinder/)**

---

## 🎯 Alinhamento com os Critérios de Avaliação 

A tabela abaixo mapeia cada critério de avaliação da disciplina às respetivas implementações no código:

| Requisito do Professor | Pontuação | Implementação Prática no Projeto | Ficheiro(s) de Origem |
| :--- | :---: | :--- | :--- |
| **1. Uso de JavaScript e DOM** | 2.0 pts | Manipulação reativa do DOM via Estado (`useState`), controlo de eventos (`onSubmit`, `onClick`), filtragem de dados e reatividade sem recarregamento de página. | `src/App.tsx`<br>`src/components/PokemonCard.tsx` |
| **2. Estilização com Framework CSS** | 1.0 pt | Layout responsivo construído com **Tailwind CSS v3**, utilizando grelhas dinâmicas, *Glassmorphism* (`backdrop-blur`) e efeitos holográficos reativos no rato. | `src/index.css`<br>`src/App.tsx` |
| **3. Consumo de API** | 1.5 pt | Integração assíncrona baseada em Promises utilizando **Axios** para consumo da API oficial do Pokémon TCG, contendo tratamento rigoroso de erros com `try/catch`. | `src/services/pokemonApi.ts`<br>`src/App.tsx` |
| **4. Uso de Bibliotecas** | 1.5 pt | Utilização do **Chart.js** (`react-chartjs-2`) para o gráfico dinâmico de distribuição de tipos e **SweetAlert2** para modais interativos e alertas *Toast*. | `src/components/BinderStats.tsx`<br>`src/components/PokemonCard.tsx` |
| **5. Complexidade e Funcionalidades** | 2.0 pts | Autocomplete preditivo de pesquisa, otimização com **Debounce Manual** (evita chamadas excessivas), gestão de **Múltiplos Fichários** e validações de segurança. | `src/App.tsx`<br>`src/components/PokemonCard.tsx` |
| **6. Uso de Framework** | 2.0 pts | Arquitetura moderna em **React** baseada em Componentes Isolados, Hooks customizados e renderização condicional de alto desempenho. | `src/main.tsx`<br>`src/App.tsx` |
| **Bónus: Persistência** | +0.5 pt | Criação do Hook customizado `useLocalStorage` para gravação reativa dos fichários diretamente no browser, persistindo mesmo após atualizar (F5). | `src/hooks/useLocalStorage.ts` |
| **Bónus: TypeScript** | +0.5 pt | Projeto 100% estruturado em **TypeScript**, com tipagem estrita de dados da API, interfaces de propriedades de componentes e mitigação de erros de compilação. | Todo o diretório `src/` |

---

## ✨ Funcionalidades em Destaque

### 1. Sistema de Múltiplos Fichários (CRUD Completo)
Em vez de uma lista única de cartas salvaguardadas, o utilizador possui total autonomia para criar dinamicamente novas pastas ou divisões para a sua coleção (ex: *"Favoritos"*, *"Cartas para Troca"*, *"Coleção Base Set"*). É possível remover pastas criadas a qualquer momento usando o botão de lixeira no cabeçalho, com exceção da pasta padrão (*"Minha Coleção"*), protegendo a integridade estrutural do estado.

### 2. Autocomplete Inteligente com Debounce Manual
À medida que o utilizador digita na barra de pesquisa, a aplicação exibe sugestões de cartas em tempo real com imagens em miniatura. Para evitar o travamento por excesso de requisições à API oficial do Pokémon TCG (*Rate Limit - Erro 429*), foi implementado um **Debounce manual de 300ms** utilizando `setTimeout`. Se o utilizador digitar rápido, o sistema aguarda que ele termine de escrever antes de disparar o pedido HTTP assíncrono.

### 3. Modal de Detalhes Interativo com SweetAlert2
Ao clicar em qualquer carta do painel de resultados, o SweetAlert2 congela o fundo elegantemente e abre um pop-up detalhado com HTML customizado de alta fidelidade. O utilizador pode conferir os preços de mercado da carta, visualizar a arte expandida e escolher em qual dos seus múltiplos fichários deseja guardar a carta. O fluxo de fechamento encadeado fecha o modal de detalhes suavemente antes de disparar a notificação flutuante de sucesso no topo do ecrã.

### 4. Skeleton Screen (Feedback de Carregamento)
As imagens das cartas de Pokémon TCG vêm de servidores externos de alta definição e costumam ser pesadas. Para evitar quebras abruptas de layout (*Cumulative Layout Shift*), o componente `PokemonCard` monitoriza o carregamento através do evento nativo `onLoad` do HTML. Enquanto a imagem está a ser descarregada, um bloco cinzento animado (pulsante) ocupa o espaço físico do card de forma fluida.

---

## 🎨 Identidade Visual (Cyber Master)

O design foi projetado sob uma atmosfera futurista inspirada em terminais de alta tecnologia:
* **Fundo Slate Profundo:** Uso de tons cinzentos-azulados escuros (`bg-slate-950`) que reduzem a fatigue ocular e fazem sobressair a cor das ilustrações das cartas.
* **Ambient Glow:** Orbes de luz neon desfocadas no fundo (ciano e roxo) com desfoque radical (`blur-3xl`), criando profundidade e movimento visual.
* **Glassmorphism:** O cabeçalho da aplicação e os painéis utilizam transparência de cor e desfoque no plano de fundo (`backdrop-blur-md`) simulando placas de vidro fosco.
* **Efeito Foil (Holográfico):** Efeitos de luz diagonal interativos que reagem dinamicamente à passagem do rato (`hover`), projetando um brilho ciano suave focado exatamente no contorno físico do card.

---

## 📂 Arquitetura de Ficheiros

O código-fonte segue uma estrutura modular rígida e limpa:

```text
pkmn-binder/
├── public/                 # Assets estáticos (Favicon de Pokébola, logótipo da header)
├── src/
│   ├── components/         # Componentes visuais isolados e reutilizáveis
│   │   ├── BinderStats.tsx # Painel analítico e gráficos do Chart.js
│   │   └── PokemonCard.tsx # Card individual, Skeleton Screen e Modal do SweetAlert2
│   ├── hooks/              # Hooks customizados para encapsular lógica e estado
│   │   └── useLocalStorage.ts
│   ├── services/           # Serviços de integração de dados assíncronos (Axios)
│   │   └── pokemonApi.ts
│   ├── App.tsx             # Orquestrador principal da aplicação, Autocomplete e abas
│   ├── index.css           # Diretivas base do Tailwind CSS v3 e estilos de animação
│   └── main.tsx            # Ponto de entrada do ecossistema React
├── package.json            # Manifesto de dependências e scripts de automação
├── tsconfig.json           # Diretivas de compilação estrita do TypeScript
└── vite.config.ts          # Configurações de build do Vite e subpasta do GitHub Pages
```

## 🛡️ Plano de Contingência Off-line (Mock Local)
Considerando que redes de Wi-Fi académicas podem sofrer oscilações ou bloquear acessos externos via Firewall durante apresentações, o projeto foi projetado com uma arquitetura de backup de dados locais:

1. **Chaveamento de Dados:**   O arquivo de integração `src/services/pokemonApi.ts` pode ser alternado rapidamente para consumir o arquivo estático local public/pokemon.json.

2. **Imagens Locais:** As imagens das cartas principais da apresentação podem ser descarregadas e guardadas diretamente na pasta `public/`, fazendo com que a aplicação funcione em absoluto isolamento (modo bunker).

3. **Lógica Autossuficiente:** Toda a computação dos dados (busca reativa, filtragem por termos, cálculo de valor e divisão das fatias do gráfico de pizza do Chart.js) é processada localmente na memória do browser.
## 🚀 Como Executar o Projeto Localmente
Certifique-se de ter o Node.js instalado em sua máquina e siga os passos abaixo no terminal:

1. **Clonar ou extrair o projeto:**
```text
Bash
cd pkmn-binder
```

2. **Instalar as dependências do ecossistema:**
```text
Bash
npm install
```

(Este comando lerá o arquivo package.json e recriará a pasta node_modules com todas as bibliotecas necessárias para rodar o projeto).

3. **Iniciar o servidor de desenvolvimento local:**
```text
Bash
npm run dev
```
4. **Acessar a aplicação:**

Abra o seu navegador e acesse o endereço local gerado pelo Vite (geralmente http://localhost:5173).

## 📦 Script de Deploy Automatizado

A aplicação conta com a biblioteca gh-pages configurada na esteira de automação do projeto. Para compilar o código em arquivos estáticos otimizados e atualizar a versão de produção na nuvem com um único comando, execute:
```text
Bash
npm run deploy
```
## 🎓 Autor
**Dylan Gomes Felix**



## 🏫 Instituição
**Instituto Federal de Brasília - Campus Brasília Curso: Tecnólogo em Sistemas para Internet**