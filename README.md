# Relevant Topics — módulo V8

Esta pasta concentra a lógica e os estilos da aba **Relevant Topics**.

## Arquivos
- `relevant-topics.js` — dados dos 15 temas, progresso 0/3–3/3, checkboxes, visualização de vídeos/leitura, anotações e flashcards da aba.
- `relevant-topics.css` — estilos específicos da aba.

## Integração no app
A raiz original `English-Advanced-Studies-main/` foi preservada. O `index.html` apenas adiciona:

```html
<link rel="stylesheet" href="relevant-topics/relevant-topics.css">
<script src="relevant-topics/relevant-topics.js"></script>
```

O módulo usa o `localStorage` já utilizado pelo aplicativo e mantém compatibilidade com os temas anteriormente marcados como concluídos: eles são migrados para `3/3`.

Não há IA, busca automática de conteúdo, scraping ou alteração das outras abas.
