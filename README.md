Aqui está um README completo ensinando a usar todos os comandos de programação do labirinto:

# Labirinto Programável

Este é um jogo de labirinto interativo onde você controla um carro 🚗 através de programação JavaScript. O objetivo é navegar pelo labirinto e chegar à bandeira 🚩 no final.

## Como Jogar

1. Abra o arquivo `index.html` em seu navegador.
2. Você verá o labirinto à esquerda e uma área de código à direita.
3. Escreva seu código JavaScript na área de código.
4. Clique no botão "Executar Código" para ver o carro se mover de acordo com suas instruções.

## Comandos Disponíveis

### Movimentação

- `mover(distancia)`: Move o carro na direção atual. A distância é medida em células do labirinto.
  Exemplo: `await mover(1);`

- `rotacionar(angulo)`: Gira o carro no sentido horário. O ângulo é medido em graus.
  Exemplo: `rotacionar(90);`

### Sensores

- `ultra_frente()`: Retorna a distância até a próxima parede à frente do carro.
- `ultra_tras()`: Retorna a distância até a próxima parede atrás do carro.
- `ultra_direita()`: Retorna a distância até a próxima parede à direita do carro.
- `ultra_esquerda()`: Retorna a distância até a próxima parede à esquerda do carro.

Exemplo: 
```javascript
let distanciaFrente = ultra_frente();
if (distanciaFrente > 0) {
    await mover(1);
}
```

### Outros Comandos

- `ver_bandeira()`: Retorna `true` se a bandeira estiver visível (a 3 células ou menos de distância).
- `posicao()`: Retorna um objeto com as coordenadas atuais do carro `{x, y}`.
- `escrever(mensagem)`: Exibe uma mensagem na área de saída.

## Exemplo de Código

Aqui está um exemplo simples de como usar os comandos para navegar pelo labirinto:

```javascript
async function explorarLabirinto() {
    while (!ver_bandeira()) {
        if (ultra_frente() > 0) {
            await mover(1);
        } else if (ultra_direita() > 0) {
            rotacionar(90);
            await mover(1);
        } else if (ultra_esquerda() > 0) {
            rotacionar(-90);
            await mover(1);
        } else {
            rotacionar(180);
        }
    }
    escrever("Bandeira encontrada!");
}

explorarLabirinto();
```

## Dicas

- Use loops (`while`, `for`) para repetir ações.
- Combine os sensores ultrassônicos com condicionais para tomar decisões de navegação.
- Lembre-se de usar `await` antes de `mover()` para garantir que o movimento seja concluído antes da próxima ação.
- Experimente diferentes estratégias para encontrar o caminho mais eficiente até a bandeira.

## Desafios

1. Tente criar um algoritmo que sempre encontre a bandeira, independentemente do layout do labirinto.
2. Otimize seu código para encontrar o caminho mais curto até a bandeira.
3. Implemente um sistema de pontuação baseado no número de movimentos realizados.

Divirta-se programando e explorando o labirinto!
