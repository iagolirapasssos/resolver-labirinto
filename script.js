const maze = document.getElementById('maze');
const codeArea = document.getElementById('code');
const runButton = document.getElementById('run');
const abortButton = document.getElementById('abort');
const output = document.getElementById('output');
const difficultySelect = document.getElementById('difficulty');
const newMazeButton = document.getElementById('newMaze');
const timerDisplay = document.getElementById('timer');

let MAZE_SIZE = 15;
let mazeLayout = [];
let carPosition = { x: 1, y: 1 };
let carAngle = 0;
let endPosition = { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 };
let startTime;
let timerInterval;
let abortController;

function log(message, type = 'info') {
    const logMessage = `[${new Date().toISOString()}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    output.innerHTML += `<div class="${type}">${logMessage}</div>`;
    output.scrollTop = output.scrollHeight;
}

function generateMaze() {
    mazeLayout = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(1));

    function carvePath(x, y) {
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]].sort(() => Math.random() - 0.5);
        
        for (let [dx, dy] of directions) {
            let nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && nx < MAZE_SIZE - 1 && ny > 0 && ny < MAZE_SIZE - 1 && mazeLayout[ny][nx] === 1) {
                mazeLayout[y + dy][x + dx] = 0;
                mazeLayout[ny][nx] = 0;
                carvePath(nx, ny);
            }
        }
    }

    mazeLayout[1][1] = 0;
    carvePath(1, 1);

    // Garantir que o ponto final seja acessível
    mazeLayout[MAZE_SIZE - 2][MAZE_SIZE - 2] = 0;

    endPosition = { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 };
    mazeLayout[endPosition.y][endPosition.x] = 2;
    
    log('Labirinto gerado com sucesso');
}

function createMaze() {
    maze.innerHTML = '';
    maze.style.gridTemplateColumns = `repeat(${MAZE_SIZE}, ${400 / MAZE_SIZE}px)`;
    maze.style.gridTemplateRows = `repeat(${MAZE_SIZE}, ${400 / MAZE_SIZE}px)`;
    
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = `${400 / MAZE_SIZE}px`;
            cell.style.height = `${400 / MAZE_SIZE}px`;
            if (mazeLayout[y][x] === 1) {
                cell.classList.add('wall');
            } else if (mazeLayout[y][x] === 2) {
                cell.textContent = '🚩';
            }
            maze.appendChild(cell);
        }
    }
    const carElement = document.createElement('div');
    carElement.id = 'car';
    carElement.textContent = '🚗';
    maze.children[carPosition.y * MAZE_SIZE + carPosition.x].appendChild(carElement);
    updateCarRotation();
    log('Labirinto criado na interface');
}

function updateCarRotation() {
    const car = document.getElementById('car');
    car.style.transform = `rotate(${carAngle}deg)`;
}

async function mover(distance) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }

            const radians = carAngle * Math.PI / 180;
            const dx = Math.sin(radians) * distance;
			const dy = -Math.cos(radians) * distance;

			const newX = Math.round(carPosition.x + dx);
			const newY = Math.round(carPosition.y + dy);


            if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && mazeLayout[newY][newX] !== 1) {
                carPosition.x = newX;
                carPosition.y = newY;
                const car = document.getElementById('car');
                maze.children[newY * MAZE_SIZE + newX].appendChild(car);
                updateCarRotation();
                log(`Carro movido para (${newX}, ${newY})`);
                if (carPosition.x === endPosition.x && carPosition.y === endPosition.y) {
		    log('Parabéns! Você chegou à bandeira!', 'success');
		    stopTimer();
		}

                resolve(true);
            } else {
                log(`Movimento inválido - Parede ou fora dos limites`, 'warn');
                resolve(false);
            }
        }, 500);
    });
}

async function rotacionar(angle) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }

            carAngle = (carAngle + angle) % 360;
            updateCarRotation();
            log(`Carro rotacionado para ${carAngle} graus`);
            resolve();
        }, 100);
    });
}

async function ultra_sensor(direction) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }

            let dx = 0, dy = 0;
            switch (direction) {
                case 'frente':
                    dx = Math.round(Math.sin(carAngle * Math.PI / 180));
                    dy = Math.round(-Math.cos(carAngle * Math.PI / 180));
                    break;
                case 'tras':
                    dx = Math.round(-Math.sin(carAngle * Math.PI / 180));
                    dy = Math.round(Math.cos(carAngle * Math.PI / 180));
                    break;
                case 'direita':
                    dx = Math.round(Math.cos(carAngle * Math.PI / 180));
                    dy = Math.round(Math.sin(carAngle * Math.PI / 180));
                    break;
                case 'esquerda':
                    dx = Math.round(-Math.cos(carAngle * Math.PI / 180));
                    dy = Math.round(-Math.sin(carAngle * Math.PI / 180));
                    break;
            }
            
            let distance = 0;
            let x = carPosition.x, y = carPosition.y;
            while (x >= 0 && x < MAZE_SIZE && y >= 0 && y < MAZE_SIZE && mazeLayout[y][x] !== 1) {
                x += dx;
                y += dy;
                distance++;
            }
            resolve(distance - 1);
        }, 100);
    });
}

async function ultra_frente() {
    return ultra_sensor('frente');
}

async function ultra_tras() {
    return ultra_sensor('tras');
}

async function ultra_direita() {
    return ultra_sensor('direita');
}

async function ultra_esquerda() {
    return ultra_sensor('esquerda');
}

async function ver_bandeira() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }
            resolve(carPosition.x === endPosition.x && carPosition.y === endPosition.y);
        }, 100);
    });
}

async function posicao() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }
            log(`Posição atual do carro: (${carPosition.x}, ${carPosition.y})`);
            resolve({ x: carPosition.x, y: carPosition.y });
        }, 100);
    });
}

async function espelharHorizontal() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }
            const car = document.getElementById('car');
            car.style.transform += ' scaleX(-1)'; // Espelhar horizontalmente
            log('Carro espelhado horizontalmente');
            resolve();
        }, 100);
    });
}

async function espelharVertical() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }
            const car = document.getElementById('car');
            car.style.transform += ' scaleY(-1)'; // Espelhar verticalmente
            log('Carro espelhado verticalmente');
            resolve();
        }, 100);
    });
}

// Função para rotacionar o carro em incrementos de 90 graus até o ângulo desejado
async function rotacionarPara(angulo) {
    while (carAngle !== angulo) {
        await rotacionar(90); // Girar o carro em 90 graus
    }
}


async function escrever(msg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execução abortada'));
                return;
            }
            log(msg, 'user');
            resolve();
        }, 100);
    });
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(elapsedTime.getUTCMilliseconds()).padStart(3, '0');
    timerDisplay.textContent = `Tempo: ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

async function executeCode() {
    log('Iniciando execução do código');
    const code = codeArea.value;
    output.innerHTML = '';
    carPosition = { x: 1, y: 1 };
    carAngle = 0;
    createMaze();
    startTimer();

    runButton.disabled = true;
    abortButton.disabled = false;
    abortController = new AbortController();

    try {
        const wrappedCode = `
        (async () => {
            ${code}
        })()
        `;
        await eval(wrappedCode);
        log('Execução do código concluída');
    } catch (error) {
        if (error.message === 'Execução abortada') {
            log('Execução do código abortada pelo usuário', 'warn');
        } else {
            log(`Erro durante a execução: ${error.message}`, 'error');
        }
    } finally {
        stopTimer();
        runButton.disabled = false;
        abortButton.disabled = true;
    }
}

runButton.addEventListener('click', executeCode);

abortButton.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
    }
});

function adjustCarSize() {
    const cell = maze.querySelector('.cell');
    if (cell) {
        const cellSize = cell.offsetWidth;
        const car = document.getElementById('car');
        if (car) {
            car.style.fontSize = `${cellSize * 0.7}px`;
        }
    }
}

function initGame() {
    MAZE_SIZE = parseInt(difficultySelect.value);
    generateMaze();
    createMaze();
    adjustCarSize();
    log('Jogo inicializado');
}

difficultySelect.addEventListener('change', initGame);
newMazeButton.addEventListener('click', initGame);

window.addEventListener('load', initGame);
window.addEventListener('resize', adjustCarSize);
