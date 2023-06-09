// Define the images
const playerImage = new Image()
playerImage.src = 'resources/images/player.png'
const object1Image = new Image()
object1Image.src = 'resources/images/plant.svg'
const object2Image = new Image()
object2Image.src = 'resources/images/yoga.png'

const backgroundImg = new Image()
backgroundImg.onload = function() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
};
backgroundImg.src = 'resources/images/space.png'

class Player {
  constructor(x, y, width, height, speed, direction) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
    this.direction = direction
  }

  // Flips the image to the direction we want

  draw() {
    if (this.direction === 'left') {
      ctx.drawImage(playerImage, this.x, this.y, this.width, this.height)
    } else {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(playerImage, -this.x - this.width, this.y, this.width, this.height)
      ctx.restore()
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed
      this.direction = 'left' // Update direction
    }
  }

  moveRight() {
    if (this.x + this.width < canvas.width) {
      this.x += this.speed
      this.direction = 'right' // Update direction
    }
  }
}

class Object {
  constructor(x, y, width, height, speed, image) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
    this.image = image
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  move() {
    this.y += this.speed
  }

  collidesWith(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    )
  }
}

let score = 0
const objects = []
const player = new Player(canvas.width / 2 - 10, canvas.height - 40, 25, 40, 7, 'left')

function spawnObject() {
  let randomX = Math.random() * canvas.width
  if (randomX >= canvas.width) {
    randomX = Math.random() * canvas.width - 20
  }
  const randomSpeed = Math.floor(Math.random() * 5) + 1 // Random speed between 1 and 3
  const randomImage = Math.random() < 0.5 ? object1Image : object2Image // Randomly choose the image (a method I discovered that acts like an if statement ?:)
  const object = new Object(randomX, 0, 20, 20, randomSpeed, randomImage)

  objects.push(object)
}

function removeObject(index) {
  objects.splice(index, 1)
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function gameLoop() {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    // Checks if the object left the canvas
    if (object.y > canvas.height) {
      removeObject(i)
    } else {
      object.move() // this.y += this.speed

      if (object.collidesWith(player)) {
        if (object.image === object1Image) {
          score += 10
        } else if (object.image === object2Image) {
          if (score >= 100) {
            const h2 = document.createElement('h2')
            h2.style.textAlign = "center";
            h2.innerHTML = "Game over!<br><span style='font-size:24px'>You deserve some peace.</span><br><span style='font-size:20px'>Your score is " + score + "</span>"
            h2.style.padding = "30px";
            canvas.parentNode.insertBefore(h2, canvas.nextSibling)

            const button = document.createElement('button')
            button.innerText = 'Play again'
            button.className = 'glow-on-hover'
            canvas.parentNode.appendChild(button)
            button.addEventListener('click', function() {
              window.location.reload()
            })
          } else {
            const h2 = document.createElement('h2')
            h2.style.textAlign = "center";
            h2.innerHTML = "Game over!<br><span style='font-size:24px'>You're not stressed enough for YOGA.</span><br><span style='font-size:20px'>Your score is " + score + "</span>"
            h2.style.padding = "30px";
            canvas.parentNode.insertBefore(h2, canvas.nextSibling)

            const button = document.createElement('button')
            button.innerText = 'Play again'
            button.className = 'glow-on-hoverr'
            canvas.parentNode.appendChild(button)
            button.addEventListener('click', function() {
              window.location.reload()
            })
          }
          clearInterval(start)
          update.stop()
        }

        removeObject(i)
      } else {
        object.draw()
      }
    }
  }
}

function update() {
  clearCanvas()
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
  player.draw()
  gameLoop()
  drawScore()
}

function drawScore() {
  ctx.font = '12px Courier New';
  ctx.fillStyle = 'white';
  ctx.fillText(`Stress LVL: ${score}`, 10, 30);
}

document.addEventListener('keydown', event => {
  if (event.code === 'ArrowLeft') {
    player.moveLeft()
  } else if (event.code === 'ArrowRight') {
    player.moveRight()
  }
})

setInterval(spawnObject, 1000) // Spawns objects every second
const start = setInterval(update, 1000 / 60) // Calls the update function 60 times per frame (60fps)