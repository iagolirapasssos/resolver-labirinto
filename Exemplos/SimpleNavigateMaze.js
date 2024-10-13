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

