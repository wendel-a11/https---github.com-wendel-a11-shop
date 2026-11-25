# Guia de versionamento Git – ShopFlex

## Criar o repositório local e o primeiro commit
```bash
git init
git add .
git commit -m "Cria estrutura inicial do sistema ShopFlex"
git branch -M main
git branch develop
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
git push -u origin develop
```

## Branches exigidas
Criar e publicar as branches de funcionalidade a partir de `develop`:
```bash
git switch develop
git switch -c cadastro
git push -u origin cadastro

git switch develop
git switch -c pesquisa
git push -u origin pesquisa

git switch develop
git switch -c alteracao
git push -u origin alteracao

git switch develop
git switch -c exclusao
git push -u origin exclusao
```

## Fluxo de integração
Em cada branch, faça alterações reais, registre commits e envie ao GitHub. Depois integre cada branch em `develop` por Pull Request ou merge. Ao concluir e testar, integre `develop` em `main`.

## Sugestões de mensagens para pelo menos 25 commits
Use as mensagens conforme cada etapa realmente for realizada; distribua o trabalho em dias diferentes e não crie commits artificiais:
1. Cria estrutura inicial do sistema ShopFlex
2. Adiciona painel administrativo da loja
3. Cria menu de navegação entre módulos
4. Define identidade visual inicial do sistema
5. Implementa layout responsivo para dispositivos móveis
6. Adiciona alternância entre tema claro e escuro
7. Cria configuração dos campos de clientes
8. Implementa cadastro de clientes
9. Adiciona validação de CPF e e-mail duplicados
10. Implementa pesquisa de clientes
11. Desenvolve edição dos dados dos clientes
12. Implementa exclusão de clientes
13. Cria cadastro e listagem de categorias
14. Implementa cadastro de produtos e controle de estoque
15. Adiciona validação de código de produto duplicado
16. Implementa seleção de categoria no cadastro de produtos
17. Cria gerenciamento de funcionários
18. Implementa registro de pedidos vinculados a clientes
19. Adiciona gerenciamento de itens dos pedidos
20. Valida cálculo do subtotal dos itens
21. Implementa registro de pagamentos
22. Cria controle de entregas e rastreamento
23. Adiciona resumo de indicadores no painel inicial
24. Documenta instalação e funcionalidades no README
25. Integra funcionalidades concluídas na branch develop
26. Realiza revisão final e integra develop na main

**Importante:** o professor pode conferir o histórico. Faça commits verdadeiros ao longo do desenvolvimento, com alterações correspondentes a cada mensagem. Não basta executar os comandos de commit sem mudanças reais.
