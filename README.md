# Relevant Topics — módulo v8

Esta pasta concentra os arquivos próprios da aba:

- `topics-data.js`: lista dos 15 temas e seus três links. Pode ser editado sem mexer no restante do app.
- `relevant-topics.css`: estilos visuais da aba.

## Integração com o aplicativo

A versão principal (`../index.html`) carrega os dois arquivos por estes caminhos:

```html
<link rel="stylesheet" href="relevant-topics/relevant-topics.css">
<script src="relevant-topics/topics-data.js"></script>
```

A lógica de renderização e os eventos continuam em `index.html` nesta versão porque compartilham armazenamento, anotações e flashcards com outras áreas do aplicativo. Isso evita duplicar ou quebrar funções existentes. Os próximos ajustes visuais e a lista de conteúdos podem ser trabalhados nos arquivos desta pasta; para alterar comportamento, procure no `index.html` o comentário `Relevant Topics` e as funções `resourceHTML`, `cardHTML` e `render`.

## Recursos da versão 8

- Check independente para TED, leitura e notícia/vídeo.
- Progresso de cada tema em `0/3`, `1/3`, `2/3` ou `3/3`.
- Progresso salvo no navegador (`localStorage`).
- Migração dos temas que já estavam marcados como estudados na v7: eles passam a iniciar com os três itens concluídos.
- Vídeos com URL direta do YouTube podem ser abertos no player incorporado no próprio card.
- Artigos tentam abrir em um quadro incorporado no próprio card. Alguns sites bloqueiam isso; nesse caso, use o link “Abrir fonte”.
- Links externos permanecem disponíveis como alternativa.

## Observação sobre vídeos

Links de pesquisa do YouTube e páginas de busca do TED não identificam um vídeo único; por isso não são incorporados automaticamente. Eles continuam acessíveis pelo link original. Um vídeo direto do YouTube (por exemplo, `youtube.com/watch?v=...`) pode usar o player interno.
