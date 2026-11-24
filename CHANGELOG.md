# Changelog

Registro das mudanças do **English Advanced Studies**. Os arquivos principais são `index.html`
(telas, estilos e lógica), `questions.js` (banco de questões), `service-worker.js` (uso offline),
`manifest.webmanifest`, `icon.svg` e a pasta `fonts/`.

## v7
- **Estilos do app:** seletor em *Settings & Backup* com 6 aparências (Adesivo, Caderno anotado, Estúdio,
  Linha de metrô, Calma, Foco), cada uma em claro e escuro. Base do CSS com variáveis ("tokens");
  cada estilo em `:root[data-style="..."]`. Fontes de cada estilo em `fonts/`, baixadas só quando usadas.
- **Gramática:** +4 tópicos (Modal Verbs, Reported Speech, Phrasal Verbs, Linking Words), 120 questões novas
  e 4 lições. Total: 10 tópicos × 30 questões (10 easy, 10 medium, 10 hard).
- **`questions.js`:** o banco saiu do `index.html` para um arquivo próprio, uma questão por linha.
- **Cronômetro** nos exercícios (salvo em *Save & exit*, zerado em *Restart*) e **tempo de estudo** dos
  últimos 7 dias no menu principal.
- **Aprendizado adaptativo:** modo *Smart practice*, painel *Where to focus*, revisão espaçada por questão
  e nível sugerido por tópico.
- **Level Test:** nova aba preparada, com estimativa indicativa (A2–C1), níveis CEFR e seções planejadas.
- **Backup (versão 7):** inclui tempo de estudo e histórico por questão; importa backups das versões 5 e 6.
- `service-worker.js`: cache `v7`, `questions.js` no pré-cache.

## v6
- Nome do app: **English Advanced Studies**. Aparência **Adesivo** em todo o app, com fontes locais (`fonts/`).
- Practice Exercises: 30 questões por tópico; dificuldade (Easy/Medium/Hard/Mixed); tipo de resposta
  (Multiple choice ou Written); *Save & exit*, *Restart* e *Exit*; sessão salva dentro do backup.
- Correção: as questões não tinham `id`, o que quebrava *Review mistakes only* e a lista de erros.

## v5 e anteriores
- v5: Practice Exercises (6 tópicos de gramática). v4: backup, sequência diária, tema claro/escuro,
  miniaturas e busca na playlist. v3: menu principal, My English Playlist, Practice Exercises (base).
  v2: barra de progresso, anotações e flashcards.
