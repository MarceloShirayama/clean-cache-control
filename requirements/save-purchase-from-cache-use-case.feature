Feature: Compras no cache

Cenário: Caso de sucesso
1. Sistema executa o comando "Salvar Compras" ✅
2. Sistema cria uma data para ser armazenada no cache
3. Sistema apaga os dados do cache atual ✅
4. Sistema grava os novos dados no cache ✅
5. Sistema não retorna nenhum erro

Cenário: Exceção - Erro ao apagar dados do cache
1. Sistema não grava os novos dados do cache ✅
2. Sistema retorna erro ✅

Cenário: Exceção - Erro ao gravar dados do cache
1. Sistema retorna erro ✅
