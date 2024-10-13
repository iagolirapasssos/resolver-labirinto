// Código para resolver o labirinto usando Busca Recursiva DFS Otimizada

// Estrutura para armazenar as células visitadas
const visited = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(false));

// Função assíncrona para resolver o labirinto usando DFS
async function solveMaze() {
    log('Iniciando a resolução do labirinto com DFS Otimizada');

    // Iniciar a busca a partir da posição atual do carro
    const success = await dfs(carPosition.x, carPosition.y);

    if (success) {
        log('Labirinto resolvido com sucesso!', 'success');
    } else {
        log('Não foi possível resolver o labirinto.', 'error');
    }
}

// Função recursiva de DFS
async function dfs(x, y) {
    // Marcar a célula atual como visitada
    visited[y][x] = true;

    // Verificar se a célula atual é a bandeira
    if (x === endPosition.x && y === endPosition.y) {
        return true;
    }

    // Direções na ordem de prioridade: Frente, Direita, Esquerda, Trás
    const directions = ['frente', 'direita', 'esquerda', 'tras'];

    for (let dir of directions) {
        // Verificar se é possível mover na direção atual
        const distance = await getDistance(dir);
        if (distance > 0) { // Existe caminho livre
            // Calcular a nova posição com base na direção
            const { newX, newY, rotation } = calculateNewPosition(x, y, dir);

            // Verificar se a nova posição já foi visitada
            if (!visited[newY][newX]) {
                // Rotacionar o carro para a direção desejada
                await rotacionarPara(rotation);

                // Mover o carro para a nova posição
                const moved = await mover(1);
                if (moved) {
                    // Recursivamente tentar resolver o labirinto a partir da nova posição
                    const found = await dfs(newX, newY);
                    if (found) {
                        return true; // Caminho encontrado
                    }

                    // Se não encontrou, voltar para a posição anterior
                    await rotacionar(180); // Girar 180 graus para trás
                    await mover(1); // Mover de volta
                    await rotacionar(180); // Restaurar a orientação original
                }
            }
        }
    }

    // Se nenhuma direção for válida, retornar falso
    return false;
}

// Função para calcular a nova posição e orientação com base na direção
function calculateNewPosition(x, y, direction) {
    let newX = x;
    let newY = y;
    let rotation = 0;

    switch(direction) {
        case 'frente':
            rotation = carAngle;
            newX += Math.round(Math.sin(carAngle * Math.PI / 180));
            newY += Math.round(-Math.cos(carAngle * Math.PI / 180));
            break;
        case 'direita':
            rotation = (carAngle + 90) % 360;
            newX += Math.round(Math.sin(rotation * Math.PI / 180));
            newY += Math.round(-Math.cos(rotation * Math.PI / 180));
            break;
        case 'esquerda':
            rotation = (carAngle - 90 + 360) % 360;
            newX += Math.round(Math.sin(rotation * Math.PI / 180));
            newY += Math.round(-Math.cos(rotation * Math.PI / 180));
            break;
        case 'tras':
            rotation = (carAngle + 180) % 360;
            newX += Math.round(Math.sin(rotation * Math.PI / 180));
            newY += Math.round(-Math.cos(rotation * Math.PI / 180));
            break;
    }

    return { newX, newY, rotation };
}

// Função para obter a distância até a parede na direção especificada
async function getDistance(direction) {
    switch(direction) {
        case 'frente':
            return await ultra_frente();
        case 'direita':
            return await ultra_direita();
        case 'esquerda':
            return await ultra_esquerda();
        case 'tras':
            return await ultra_tras();
        default:
            return 0;
    }
}

// Função para rotacionar o carro para um ângulo específico
async function rotacionarPara(targetAngle) {
    let angleDifference = (targetAngle - carAngle + 360) % 360;
    if (angleDifference === 0) return;

    if (angleDifference <= 180) {
        await rotacionar(angleDifference);
    } else {
        await rotacionar(angleDifference - 360);
    }
}

// Iniciar a resolução do labirinto após carregar o jogo
await solveMaze();

