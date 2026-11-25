# Relevant Topics — V8.1

Esta pasta contém apenas a camada de melhoria da aba **Relevant Topics**.

Ela não duplica os dados dos 15 temas nem substitui o renderizador original. O `index.html` fornece uma pequena ponte (`window.__EAS_RELEVANT_TOPICS__`) com referências ao estado já existente do aplicativo.

## O que esta camada adiciona
- 3 atividades independentes por tema: TED/Video, Reading e News/Video Podcast.
- Progresso por tema de 0/3 a 3/3.
- Conclusão automática do tema ao atingir 3/3.
- Persistência independente do progresso em `localStorage`.
- Tentativa de incorporação de YouTube/TED e leitura via iframe, sempre com link externo de fallback.

Não há AI, scraping ou busca automática de conteúdo nesta versão.
