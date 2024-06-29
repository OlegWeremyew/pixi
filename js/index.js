import {Application, Graphics, Rectangle} from "./pixi.mjs";
import {assetsMap} from "./assetsMap.js";
import {Tank} from "./Tank.js";
import {TweenManager} from "./Tween.js";

// Create the application
const app = new Application({
  width: 800,
  height: 800,
  backgroundColor: 0xc2c2c2,
  view: document.getElementById("canvas"),
});

const runGame = () => {
  const marker = new Graphics()
    .beginFill(0xff00000)
    .drawRect(0, 0, 10, 10)
    .endFill();

  const tank = new Tank();
  //hide tank property
  //tank.view.visible = false

  app.stage.addChild(tank.view);
  app.stage.addChild(marker);

  app.stage.position.set(800 / 2, 800 / 2);

  const onPointerDown = ({data}) => {
    const position = data.getLocalPosition(app.stage);
    app.stage.addChild(
      new Graphics()
        .beginFill(0x00000, 1)
        .drawCircle(position.x, position.y, 5)
        .endFill()
    )
  }

  window["TANK"] = tank;

  const tweenManager = new TweenManager(app.ticker)

  const moveTank = ({data}) => {
    //body center position offset
    const distanceToCenter = data.getLocalPosition(app.stage);
    //tank center position offset
    const distanceToTank = data.getLocalPosition(tank.view);

    const angle = Math.atan2(distanceToTank.y, distanceToTank.x)

    let callAmount = 2
    const move = () => {
      callAmount -= 1

      if (callAmount > 0) return

      tweenManager.createTween(
        tank,
        3000,
        {x: distanceToTank.x, y: distanceToTank.y},
        {
          onStart: () => tank.startTracks(),
          onFinish: () => tank.stopTracks(),
        },
      );
    }

    tweenManager.createTween(
      tank,
      1000,
      {towerDirection: angle},
      {
        onFinish: () => move(),
      },
    );

    tweenManager.createTween(
      tank,
      2000,
      {bodyDirection: angle},
      {
        onStart: () => tank.startTracks(),
        onFinish: () => {
          tank.stopTracks();
          move();
        },
      },
    );
  }

  //app.stage.on('pointerdown', onPointerDown, undefined);
  app.stage.on('pointerdown', moveTank, undefined);
  app.stage.interactive = true;
  app.stage.interactiveChildren = false;
  app.stage.hitArea = new Rectangle(-400, -400, 800, 800);


  //add black rectangle
  // const rectangle = new Graphics().beginFill(0x000000, 1).drawRect(0,0, 100, 100).endFill()
  // app.stage.addChild(rectangle)
  //
  //
  // let value = 0
  // const stepValue = 0.01
  // const offset = 200
  //
  // app.ticker.add(()=>{
  //   // console.log(app.ticker.lastTime)
  //   // console.log(app.ticker.deltaMS)
  //   // console.log(app.ticker.deltaTime)
  //
  //   value += stepValue
  //   console.log(value)
  //   //change opacity
  //   rectangle.alpha = Math.cos(value)
  //   //change x-line position
  //   rectangle.position.x = offset * Math.cos(value)
  // })
}

assetsMap.sprites.forEach(({name, url}) => app.loader.add(name, url));

app.loader.load(runGame);
