# Photo Opp - NexLab

Este projeto é uma aplicação "Photo Opp" desenvolvida para teste de admissão na empresa NexLab.
A aplicação permite a captura de fotos e a geração de QR codes para download das imagens. 

Ela integra-se com a API do Imgur para armazenamento e gerenciamento das imagens.

## Visão Geral das Telas

O aplicativo possui as seguintes telas principais:

1.  **Tela Inicial (`/`)**: Botão "Iniciar" para começar a sessão de fotos.
2.  **Tela de Captura (`/checkin`)**:
    * Exibe a câmera para captura de fotos.
    * Possui uma contagem regressiva antes da foto.
    * Permite a visualização da foto capturada com opções para "Refazer" ou "Continuar".
    * Após confirmar, a imagem é enviada para o Imgur e um QR Code é gerado para download da imagem.
3.  **Tela de Finalização (`/checkout`)**: Exibe uma mensagem de agradecimento e o QR Code gerado para o download da imagem final.
4.  **Tela de Configuração (`/config`)**: Apresenta um relatório das imagens enviadas e permite a navegação entre elas.

## Como Acessar o Relatório (Configuração)

Para acessar a tela de **Relatório/Configuração**, basta **clicar no logo da NexLab** que aparece no centro superior da **tela inicial**.

## Configuração do Ambiente

Para que o projeto funcione corretamente, você precisará criar um arquivo de variáveis de ambiente (`.env`) na raiz do projeto.

### Variáveis de Ambiente Necessárias

Crie um arquivo chamado `.env` na raiz do seu projeto e adicione as seguintes variáveis:

```bash
# Seu token de acesso à API do Imgur
# Você pode obter um token seguindo as instruções da documentação do Imgur API para OAuth 2.0 (Client-side usage)
IMGUR_ACCESS_TOKEN=SEU_ACCESS_TOKEN_AQUI

# O ID do álbum do Imgur onde as imagens serão armazenadas
# As imagens podem ser enviadas para um álbum específico.
IMGUR_DEFAULT_ALBUM_ID=SEU_ALBUM_ID_AQUI
```

## Getting Started

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
