const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: '#228B22', // verde pasto
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('home', './assets/home.png');
  this.load.image('player', './assets/player.png');
  this.load.image('cow', './assets/cow.png');
  this.load.image('chicken', './assets/chicken.png');
  this.load.image('parcel', './assets/parcel.png');
  this.load.image('pumpkin', './assets/pumpkin.png');
  this.load.image('tomato', './assets/tomato.png');
  this.load.image('tree', './assets/tree.png');
}

function create() {
  const scene = this;

  // Casa arriba
  this.home = this.add.image(512, 150, 'home').setScale(1.5).setDepth(1);

  // Árboles decorativos
  const treePositions = [
    {x: 150, y: 150}, {x: 870, y: 150}, {x: 150, y: 600}, {x: 870, y: 600}
  ];
  this.trees = [];
  treePositions.forEach(pos => {
    const tree = this.add.image(pos.x, pos.y, 'tree').setScale(1).setDepth(1);
    this.trees.push(tree);
  });

  // Jugador
  this.player = this.add.image(512, 650, 'player').setScale(2).setDepth(3);

  // Arrays
  this.parcels = [];
  this.crops = [];
  this.cows = [];
  this.chickens = [];

  // Parcelas
  const parcelPositions = [
    { x: 300, y: 500 }, { x: 450, y: 500 },
    { x: 574, y: 500 }, { x: 724, y: 500 }
  ];
  parcelPositions.forEach(pos => {
    const parcel = this.add.image(pos.x, pos.y, 'parcel').setScale(2).setDepth(2);
    parcel.setInteractive();
    parcel.parcelIndex = parcelPositions.indexOf(pos);
    this.parcels.push(parcel);
  });

  // Plantar cultivos
  this.parcels.forEach(parcel => {
    parcel.on('pointerdown', () => {
      const exists = scene.crops.find(c => c.parcelIndex === parcel.parcelIndex);
      if (!exists) {
        const type = parcel.parcelIndex % 2 === 0 ? 'pumpkin' : 'tomato';
        const crop = scene.add.image(parcel.x, parcel.y, type).setScale(2).setDepth(3);
        crop.parcelIndex = parcel.parcelIndex;
        scene.crops.push(crop);
      }
    });
  });

  // Movimiento del jugador
  this.input.on('pointerdown', pointer => {
    scene.tweens.add({
      targets: scene.player,
      x: pointer.x,
      y: pointer.y,
      duration: 1000
    });
  });

  // Botones para comprar animales
  document.getElementById("buyCow").addEventListener("click", () => {
    if (scene.cows.length < 4) {
      const cow = scene.add.image(150 + scene.cows.length * 200, 400, 'cow').setScale(2).setDepth(2);
      scene.cows.push(cow);
    } else {
      alert("Ya compraste las 4 vacas máximas");
    }
  });

  document.getElementById("buyChicken").addEventListener("click", () => {
    if (scene.chickens.length < 4) {
      const chicken = scene.add.image(200 + scene.chickens.length * 200, 420, 'chicken').setScale(2).setDepth(2);
      scene.chickens.push(chicken);
    } else {
      alert("Ya compraste las 4 gallinas máximas");
    }
  });
}

function update() {
  // Cosechar cultivos
  this.crops.forEach((crop, index) => {
    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      crop.x, crop.y
    );
    if (distance < 30) {
      crop.destroy();
      this.crops.splice(index, 1);
    }
  });

  // Movimiento aleatorio de animales
  Phaser.Actions.Call(this.cows, cow => {
    cow.x += Phaser.Math.Between(-1, 1);
    cow.y += Phaser.Math.Between(-1, 1);
  });
  Phaser.Actions.Call(this.chickens, chicken => {
    chicken.x += Phaser.Math.Between(-1, 1);
    chicken.y += Phaser.Math.Between(-1, 1);
  });
}