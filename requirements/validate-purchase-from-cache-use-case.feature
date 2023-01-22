Feature: Validar compras do cache

Cenário: Caso de sucesso
1. Sistema executa o comando "Validar Compras" ✅
2. Sistema carrega os dados do cache ✅
3. Sistema valida se o cache tem menos de 3 dias ✅

Cenário: Exceção - Erro ao carregar dados do cache
1. Sistema limpa o cache ✅

Cenário: Exceção - Cache expirado
1. Sistema limpa o cache ✅
