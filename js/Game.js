class Game {
  constructor() {}

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  async start() {
    if (gameState === 0) {
      player = new Player();
      var playerCountRef = await database.ref("playerCount").once("value");
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form();
      form.display();
    }

    car1 = createSprite(100, 200);
    car1.addImage("car1", car1_img);
    car2 = createSprite(300, 200);
    car2.addImage("car2", car2_img);
    car3 = createSprite(500, 200);
    car3.addImage("car3", car3_img);
    car4 = createSprite(700, 200);
    car4.addImage("car4", car4_img);
    cars = [car1, car2, car3, car4];
    if (player.index != null) {
      player.x = player.index * 200 + 175;
      player.update();
    }
  }

  play() {
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();
    if (allPlayers !== undefined) {
      background(rgb(0, 255, 0));
      image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);

      //index of the array
      var index = 0;

      //x and y position of the cars
      // x = player.x;
      var y;

      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //position the cars a little away from each other in x direction
        x = allPlayers[plr].x;
        //  x=x+200

        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index - 1].x = allPlayers[plr].x; //add
        cars[index - 1].y = y;
        cars[0].bounceOff(cars[1]); //add
        cars[0].bounceOff(cars[2]);
        cars[0].bounceOff(cars[3]);
        cars[1].bounceOff(cars[0]);
        cars[1].bounceOff(cars[2]);
        cars[1].bounceOff(cars[3]);
        cars[2].bounceOff(cars[0]);
        cars[2].bounceOff(cars[1]);
        cars[2].bounceOff(cars[3]);
        cars[3].bounceOff(cars[0]);
        cars[3].bounceOff(cars[1]);
        cars[3].bounceOff(cars[2]);

        if (index === player.index) {
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;
          player.x = cars[index - 1].x; //add
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
        }

        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }
    }

    if (keyIsDown(UP_ARROW) && player.index !== null) {
      player.distance += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.index !== null) {
      //player.x=x
      player.x -= 2;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
      //player.x=x
      player.x += 2;
      player.update();
    }
    if (player.distance > 3760) {
      gameState = 2;
      player.rank = globalRank + 1;
      Player.updateCarsAtEnd(player.rank);
      player.update();
    }

    drawSprites();
  }

  end() {
    console.log("Game got End");
    console.log(player.rank);
    Player.getPlayerInfo();
    var index = 0;
    var y = 0;
    var x = 175;
    for (var plr in allPlayers) {
      //add 1 to the index for every loop
      index = index + 1;

      //position the cars a little away from each other in x direction
      x = x + 200;
      //use data form the database to display the cars in y direction
      y = displayHeight - allPlayers[plr].distance;
      cars[index - 1].x = x;
      cars[index - 1].y = y;
      if (allPlayers[plr].rank != 0) {
        var rank = createElement("h4");
        rank.position(displayWidth / 2, allPlayers[plr].rank * 20);
        rank.html(allPlayers[plr].name + ": " + allPlayers[plr].rank);

        if (index === player.index) {
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;
          stroke(10);
          fill("red");
        }
      }
      //textSize(15);
      //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
    }
  }
}
