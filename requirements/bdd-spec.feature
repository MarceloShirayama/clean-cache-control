Feature: Cliente online

Como um cliente online
Quero que o sistema mostre minhas compras
Para poder controlar minhas despesas

Cenário: Obter dados da cliente online API

Dado que o cliente tem conexão coma internet
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir suas compras vindo de uma API

Feature: Cliente offline

Como um cliente offline
Quero que o sistema mostre minhas últimas compras gravadas
Para poder ver minhas despesas mesmo offline

Cenário: Obter dados do cache

Dado que o cliente não tem conexão com a internet
E exista algum dado gravado no cache
E os dados do cache forem mais novos que 3 dias
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir suas compras vindas do cache

Dado que o cliente não tem conexão com a internet
E exista algum dado gravado no cache
E os dados do cache forem mais velhos ou iguais a 3 dias
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir uma mensagem de erro

Dado que o cliente não tem conexão com a internet
E o cache esteja vazio
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir uma mensagem de erro
