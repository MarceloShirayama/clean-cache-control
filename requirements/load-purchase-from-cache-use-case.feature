Feature: Carregar compras

Cenário: Caso de sucesso
1. Sistema executa o comando "Carregar Compras"
2. Sistema carrega os dados do cache
3. Sistema valida se o cache tem menos de 3 dias
4. Sistema cria uma lista de compras a partir dos dados do cache
5. Sistema retorna uma lista de compras

Cenário: Exceção - Erro ao carregar dados do cache
1. Sistema limpa o cache
2. Sistema retorna uma lista vazia

Cenário: Exceção - Cache expirado
1. Sistema limpa o cache
2. Sistema retorna uma lista vazia

Cenário: Exceção - Cache vazio
1. Sistema retorna uma lista vazia
