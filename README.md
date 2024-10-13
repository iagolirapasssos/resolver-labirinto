# Programmable Maze

Welcome to the **Programmable Maze**! This interactive maze game allows you to control a car 🚗 through JavaScript programming. Your goal is to navigate the car through the maze and reach the flag 🚩 at the end.

## Table of Contents

- [How to Play](#how-to-play)
- [Available Commands](#available-commands)
  - [Movement](#movement)
  - [Sensors](#sensors)
  - [Utility Functions](#utility-functions)
- [Example Code](#example-code)
- [Tips](#tips)
- [Challenges](#challenges)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## How to Play

1. **Open the Game:**
   - Open the `index.html` file in your web browser.

2. **Understand the Interface:**
   - **Maze Area:** Located on the left side, displaying the maze layout.
   - **Code Editor:** Located on the right side, where you will write your JavaScript code.
   - **Controls:** Buttons to execute or abort your code, select difficulty levels, and generate new mazes.
   - **Output Area:** Displays logs and messages related to your code execution.
   - **Timer:** Tracks the time taken to solve the maze.

3. **Write Your Code:**
   - Enter your JavaScript code in the **Code Editor** to control the car's movements and interactions.

4. **Execute Your Code:**
   - Click the **"Run Code"** button to execute your instructions. The car will move according to your code.
   - Use the **"Abort"** button to stop the execution at any time.

5. **Reach the Flag:**
   - Navigate the car through the maze to reach the flag 🚩. Upon success, a congratulatory message will appear, and the timer will stop.

## Available Commands

### Movement

- **`mover(distance)`**
  - **Description:** Moves the car forward in its current direction.
  - **Parameter:** 
    - `distance` (number) — The number of cells to move.
  - **Example:**
    ```javascript
    await mover(1);
    ```

- **`rotacionar(angle)`**
  - **Description:** Rotates the car clockwise by the specified angle.
  - **Parameter:**
    - `angle` (number) — The angle in degrees to rotate.
  - **Example:**
    ```javascript
    rotacionar(90);
    ```

### Sensors

- **`ultra_frente()`**
  - **Description:** Returns the distance to the nearest wall in front of the car.
  - **Returns:** `number` — Distance in cells.
  - **Example:**
    ```javascript
    let distanceFront = await ultra_frente();
    ```

- **`ultra_tras()`**
  - **Description:** Returns the distance to the nearest wall behind the car.
  - **Returns:** `number` — Distance in cells.
  - **Example:**
    ```javascript
    let distanceBack = await ultra_tras();
    ```

- **`ultra_direita()`**
  - **Description:** Returns the distance to the nearest wall to the right of the car.
  - **Returns:** `number` — Distance in cells.
  - **Example:**
    ```javascript
    let distanceRight = await ultra_direita();
    ```

- **`ultra_esquerda()`**
  - **Description:** Returns the distance to the nearest wall to the left of the car.
  - **Returns:** `number` — Distance in cells.
  - **Example:**
    ```javascript
    let distanceLeft = await ultra_esquerda();
    ```

### Utility Functions

- **`ver_bandeira()`**
  - **Description:** Checks if the flag is visible (within 3 cells distance).
  - **Returns:** `boolean` — `true` if the flag is visible, otherwise `false`.
  - **Example:**
    ```javascript
    if (await ver_bandeira()) {
        log("Flag is visible!");
    }
    ```

- **`posicao()`**
  - **Description:** Retrieves the current position of the car.
  - **Returns:** `object` — `{ x, y }` coordinates.
  - **Example:**
    ```javascript
    let currentPosition = await posicao();
    log(`Current Position: (${currentPosition.x}, ${currentPosition.y})`);
    ```

- **`bussola()`**
  - **Description:** Provides the current position and orientation of the car, acting as a compass sensor.
  - **Returns:** `object` — `{ x, y, angle }` where `x` and `y` are the current coordinates, and `angle` represents the direction the car is facing in degrees.
  - **Example:**
    ```javascript
    let compass = await bussola();
    log(`Car is at (${compass.x}, ${compass.y}) facing ${compass.angle} degrees`);
    ```

- **`escrever(mensagem)`**
  - **Description:** Displays a message in the output area.
  - **Parameter:**
    - `mensagem` (string) — The message to display.
  - **Example:**
    ```javascript
    await escrever("Hello, World!");
    ```

- **`espelhar_horizontal()`**
  - **Description:** Mirrors the car horizontally.
  - **Example:**
    ```javascript
    await espelhar_horizontal();
    ```

- **`espelhar_vertical()`**
  - **Description:** Mirrors the car vertically.
  - **Example:**
    ```javascript
    await espelhar_vertical();
    ```

## Example Code

Here is a simple example demonstrating how to use the available commands to navigate through the maze:

```javascript
// Improved navigateMaze function using the Right-Hand Rule

async function navigateMaze() {
    // Continue navigating until the flag is found
    while (!await ver_bandeira()) {
        // Check the distance to the front
        let distanceFront = await ultra_frente();
        // Check the distance to the right
        let distanceRight = await ultra_direita();
        // Check the distance to the left
        let distanceLeft = await ultra_esquerda();
        
        if (distanceFront > 0) {
            // If there is space in front, move forward
            await mover(1);
        } else if (distanceRight > 0) {
            // If blocked in front but space to the right, turn right and move forward
            await rotacionar(90);
            await mover(1);
        } else if (distanceLeft > 0) {
            // If blocked in front and to the right but space to the left, turn left and move forward
            await rotacionar(-90);
            await mover(1);
        } else {
            // If blocked in all directions, turn around (180 degrees)
            await rotacionar(180);
        }
    }
    // Once the flag is found, display a success message
    await escrever("Flag found!");
}

// Start navigating the maze
navigateMaze();

```

### Explanation:

1. **Loop Until Flag is Found:**
   - The `while` loop continues until `ver_bandeira()` returns `true`.

2. **Check Distance Ahead:**
   - If there is space (`distanceFront > 0`), move forward.

3. **Rotate and Check Right:**
   - If blocked ahead, rotate 90 degrees to the right.
   - Check the distance to the right.
   - If space is available, move forward.
   - If not, rotate back to the original direction.

4. **Log Success:**
   - Once the flag is found, display a success message.

## Tips

- **Use Loops and Conditionals:**
  - Utilize `while` and `for` loops along with `if-else` statements to create dynamic navigation strategies.

- **Leverage Sensors:**
  - Combine sensor readings with conditional logic to make informed decisions about movements and rotations.

- **Ensure Asynchronous Operations:**
  - Remember to use `await` before functions like `mover()`, `rotacionar()`, and sensor functions to ensure actions complete before proceeding.

- **Experiment with Strategies:**
  - Try different movement and rotation patterns to find the most efficient path to the flag.

## Challenges

1. **Ensure Always Reaching the Flag:**
   - Create an algorithm that guarantees the car will find the flag, regardless of the maze layout.

2. **Optimize for Shortest Path:**
   - Modify your code to find the shortest possible path to the flag, minimizing the number of movements.

3. **Implement a Scoring System:**
   - Introduce a scoring mechanism based on the number of moves or time taken to reach the flag.

4. **Visual Enhancements:**
   - Add visual indicators for visited cells or the path taken by the car to improve clarity.

5. **Error Handling:**
   - Enhance your code to handle unexpected scenarios, such as getting stuck or encountering dead ends.

## Features

- **Interactive Maze Generation:**
  - Generate mazes of varying sizes and complexities to challenge your programming skills.

- **Asynchronous Control:**
  - Utilize `async` and `await` to manage car movements and sensor readings seamlessly.

- **Comprehensive Sensor Integration:**
  - Access detailed sensor data to make intelligent navigation decisions.

- **Dynamic Logging:**
  - Receive real-time feedback and logs of your car's actions and decisions in the output area.

- **Utility Functions:**
  - Access additional functions like `bussola()`, `escrever()`, and mirroring functions to enhance control over the car.

- **User-Friendly Interface:**
  - Intuitive layout with separate areas for the maze, code editor, controls, and output.

- **Responsive Design:**
  - The maze and car adjust dynamically to different screen sizes for optimal viewing.

## Contributing

We welcome contributions to enhance the Programmable Maze! Whether it's adding new features, improving documentation, or fixing bugs, your efforts are appreciated.

1. **Fork the Repository**
2. **Create a New Branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a Pull Request**

Please ensure your contributions adhere to the project's coding standards and include relevant documentation.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy programming and navigating through the maze! If you have any questions or need assistance, feel free to reach out.

---

## Additional Notes

### Adding the `bussola()` Function to `script.js`

To fully utilize the `bussola()` function, ensure that it's included in your `script.js`. Here's how you can integrate it:

```javascript
// Função bússola para obter posição e direção do carro
async function bussola() {
    const pos = await posicao();
    return { x: pos.x, y: pos.y, angle: carAngle };
}
```

**Usage Example:**

```javascript
async function getCompassInfo() {
    let compass = await bussola();
    log(`Car is at (${compass.x}, ${compass.y}) facing ${compass.angle} degrees`);
}

getCompassInfo();
```

### Ensuring the Flag is in a Valid White Area for Level 1

With the updated `generateMaze` function, the flag is now guaranteed to be placed on a white cell. However, for Level 1 (10x10), you might want to verify the maze generation to ensure optimal pathfinding. Here's how you can manually adjust the maze if needed:

1. **Check the Flag Position:**
   - After generating the maze, ensure that `endPosition` is accessible from `carPosition`.
   
2. **Manual Adjustment (Optional):**
   - If you notice that the flag is not reachable, you can manually carve a path by setting specific cells to `0` to ensure connectivity.

3. **Testing:**
   - Generate multiple mazes for Level 1 to confirm that the flag placement works consistently.

---

By implementing these changes, your **Programmable Maze** will be more robust, user-friendly, and educational for those learning JavaScript and algorithmic problem-solving.

If you have any further questions or need additional assistance, feel free to ask!
