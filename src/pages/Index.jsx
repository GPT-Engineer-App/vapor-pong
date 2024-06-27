import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballSize = 10;
    const playerSpeed = 6;
    const ballSpeed = 4;

    let player1Y = canvas.height / 2 - paddleHeight / 2;
    let player2Y = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2 - ballSize / 2;
    let ballY = canvas.height / 2 - ballSize / 2;
    let ballVelocityX = ballSpeed;
    let ballVelocityY = ballSpeed;

    const drawRect = (x, y, w, h, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
    };

    const drawCircle = (x, y, r, color) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();
    };

    const drawNet = () => {
      for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "#fff");
      }
    };

    const draw = () => {
      drawRect(0, 0, canvas.width, canvas.height, "#2e026d"); // Background
      drawNet();
      drawRect(0, player1Y, paddleWidth, paddleHeight, "#ff00ff"); // Player 1
      drawRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight, "#00ffff"); // Player 2
      drawCircle(ballX, ballY, ballSize, "#ff00ff"); // Ball
    };

    const update = () => {
      ballX += ballVelocityX;
      ballY += ballVelocityY;

      if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballVelocityY = -ballVelocityY;
      }

      if (ballX + ballSize > canvas.width) {
        ballVelocityX = -ballVelocityX;
      }

      if (ballX - ballSize < 0) {
        ballVelocityX = -ballVelocityX;
      }

      if (
        ballX - ballSize < paddleWidth &&
        ballY > player1Y &&
        ballY < player1Y + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }

      if (
        ballX + ballSize > canvas.width - paddleWidth &&
        ballY > player2Y &&
        ballY < player2Y + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }
    };

    let animationFrameId;

    const gameLoop = () => {
      if (isGameRunning) {
        draw();
        update();
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "w":
          player1Y = Math.max(player1Y - playerSpeed, 0);
          break;
        case "s":
          player1Y = Math.min(player1Y + playerSpeed, canvas.height - paddleHeight);
          break;
        case "ArrowUp":
          player2Y = Math.max(player2Y - playerSpeed, 0);
          break;
        case "ArrowDown":
          player2Y = Math.min(player2Y + playerSpeed, canvas.height - paddleHeight);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (isGameRunning) {
      gameLoop();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameRunning]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="4xl" color="#ff00ff">Vaporwave Pong</Text>
        <Box
          as="canvas"
          ref={canvasRef}
          width={800}
          height={400}
          border="2px solid #00ffff"
          backgroundColor="#2e026d"
        />
        <Button
          colorScheme="pink"
          onClick={() => setIsGameRunning(!isGameRunning)}
        >
          {isGameRunning ? "Stop Game" : "Start Game"}
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;