// script.js

// DOM Elements
const maze = document.getElementById('maze');
const codeArea = document.getElementById('code');
const runButton = document.getElementById('run');
const abortButton = document.getElementById('abort');
const output = document.getElementById('output');
const difficultySelect = document.getElementById('difficulty');
const newMazeButton = document.getElementById('newMaze');
const timerDisplay = document.getElementById('timer');

// Game Variables
let MAZE_SIZE = 15;
let mazeLayout = [];
let carPosition = { x: 1, y: 1 };
let carAngle = 0;
let endPosition = { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 };
let startTime;
let timerInterval;
let abortController;

// Logging Function
function log(message, type = 'info') {
    const logMessage = `[${new Date().toISOString()}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    output.innerHTML += `<div class="${type}">${logMessage}</div>`;
    output.scrollTop = output.scrollHeight;
}

// Maze Generation Function
function generateMaze() {
    // Initialize maze with all walls
    mazeLayout = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(1));

    // Recursive Backtracking Algorithm to carve paths
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

    // Set starting position
    mazeLayout[1][1] = 0;
    carvePath(1, 1);

    // Ensure end position is accessible
    mazeLayout[MAZE_SIZE - 2][MAZE_SIZE - 2] = 0;
    endPosition = { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 };
    mazeLayout[endPosition.y][endPosition.x] = 2; // Mark the flag

    // Special handling for Level 1 (10x10) to ensure the flag is on a white cell
    if (MAZE_SIZE === 10) {
        // Ensure the end position is connected to the start
        connectEndToStart();
    }

    log('Maze generated successfully');
}

// Function to connect the end position to the start position for Level 1
function connectEndToStart() {
    // Simple approach: carve a direct path from end to start
    let x = endPosition.x;
    let y = endPosition.y;

    while (x > 1 || y > 1) {
        if (x > 1) {
            x -= 1;
            mazeLayout[y][x] = 0;
        } else if (y > 1) {
            y -= 1;
            mazeLayout[y][x] = 0;
        }
    }

    // Re-mark the flag
    mazeLayout[endPosition.y][endPosition.x] = 2;
}

// Function to Create Maze on Interface
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

    // Ensure the start position is open
    if (mazeLayout[carPosition.y][carPosition.x] === 1) {
        mazeLayout[carPosition.y][carPosition.x] = 0;
    }

    // Ensure the end position is open and marked
    if (mazeLayout[endPosition.y][endPosition.x] === 1) {
        mazeLayout[endPosition.y][endPosition.x] = 0;
        mazeLayout[endPosition.y][endPosition.x] = 2; // Re-mark the flag
    }

    // Create the car element
    const carElement = document.createElement('div');
    carElement.id = 'car';
    carElement.textContent = '🚗';
    maze.children[carPosition.y * MAZE_SIZE + carPosition.x].appendChild(carElement);
    updateCarRotation();
    log('Maze created on interface');
}

// Function to Update Car's Rotation
function updateCarRotation() {
    const car = document.getElementById('car');
    car.style.transform = `rotate(${carAngle}deg)`;
}

// Car Control Functions
async function mover(distance) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
                return;
            }

            const radians = carAngle * Math.PI / 180;
            const dx = Math.sin(radians) * distance;
            const dy = -Math.cos(radians) * distance;

            const newX = Math.round(carPosition.x + dx);
            const newY = Math.round(carPosition.y + dy);

            // Check if the new position is within bounds and not a wall
            if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && mazeLayout[newY][newX] !== 1) {
                // Remove the car from the previous position
                const car = document.getElementById('car');
                maze.children[carPosition.y * MAZE_SIZE + carPosition.x].removeChild(car);

                // Update car position
                carPosition.x = newX;
                carPosition.y = newY;

                // Add the car to the new position
                maze.children[newY * MAZE_SIZE + newX].appendChild(car);
                updateCarRotation();
                log(`Car moved to (${newX}, ${newY})`);

                // Check if reached the flag
                if (carPosition.x === endPosition.x && carPosition.y === endPosition.y) {
                    log('Congratulations! You reached the flag!', 'success');
                    stopTimer();
                }

                resolve(true);
            } else {
                log(`Invalid move - Wall or out of bounds`, 'warn');
                resolve(false);
            }
        }, 500);
    });
}

async function rotacionar(angle) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
                return;
            }

            carAngle = (carAngle + angle) % 360;
            updateCarRotation();
            log(`Car rotated to ${carAngle} degrees`);
            resolve();
        }, 100);
    });
}

async function ultra_sensor(direction) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
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
                reject(new Error('Execution aborted'));
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
                reject(new Error('Execution aborted'));
                return;
            }
            log(`Current car position: (${carPosition.x}, ${carPosition.y})`);
            resolve({ x: carPosition.x, y: carPosition.y });
        }, 100);
    });
}

async function espelharHorizontal() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
                return;
            }
            const car = document.getElementById('car');
            car.style.transform += ' scaleX(-1)'; // Mirror horizontally
            log('Car mirrored horizontally');
            resolve();
        }, 100);
    });
}

async function espelharVertical() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
                return;
            }
            const car = document.getElementById('car');
            car.style.transform += ' scaleY(-1)'; // Mirror vertically
            log('Car mirrored vertically');
            resolve();
        }, 100);
    });
}

// Function to rotate the car in 90-degree increments until it reaches the desired angle
async function rotacionarPara(angulo) {
    while (carAngle !== angulo) {
        await rotacionar(90); // Rotate the car by 90 degrees
    }
}

// Function to write a message to the output area
async function escrever(msg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (abortController.signal.aborted) {
                reject(new Error('Execution aborted'));
                return;
            }
            log(msg, 'user');
            resolve();
        }, 100);
    });
}

// Compass Sensor Function: Returns the car's current position and angle
async function bussola() {
    const pos = await posicao();
    return { x: pos.x, y: pos.y, angle: carAngle };
}

// Timer Functions
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
    timerDisplay.textContent = `Time: ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Function to Adjust Car Size Based on Cell Size
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

// Function to Initialize the Game
function initGame() {
    MAZE_SIZE = parseInt(difficultySelect.value);
    generateMaze();
    carPosition = { x: 1, y: 1 };
    carAngle = 0;
    createMaze();
    adjustCarSize();
    log('Game initialized');
}

// Function to Execute User Code
async function executeCode() {
    log('Starting code execution');
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
        log('Code execution completed');
    } catch (error) {
        if (error.message === 'Execution aborted') {
            log('Code execution aborted by user', 'warn');
        } else {
            log(`Error during execution: ${error.message}`, 'error');
        }
    } finally {
        stopTimer();
        runButton.disabled = false;
        abortButton.disabled = true;
    }
}

// Function to Abort Code Execution
function abortExecution() {
    if (abortController) {
        abortController.abort();
        log('Aborting execution...', 'warn');
    }
}

// Event Listeners for Buttons
runButton.addEventListener('click', executeCode);
abortButton.addEventListener('click', abortExecution);

// Event Listeners for Game Initialization and Car Size Adjustment
window.addEventListener('resize', adjustCarSize);
window.addEventListener('load', initGame);
difficultySelect.addEventListener('change', initGame);
newMazeButton.addEventListener('click', initGame);

