// Game state variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// DOM elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const button5 = document.querySelector("#button5");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Create weapon buttons container
const weaponButtonsContainer = document.createElement("div");
weaponButtonsContainer.id = "weaponButtonsContainer";
document.getElementById("controls").appendChild(weaponButtonsContainer);

// Weapons data
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

// Monsters data
const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

// Locations data
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon", "Weapons", "Restart"],
    "button functions": [goStore, goCave, fightDragon, goWeapons, restart],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square", "Weapons", "Restart"],
    "button functions": [buyHealth, buyWeapon, goTown, goWeapons, restart],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square", "Weapons", "Restart"],
    "button functions": [fightSlime, fightBeast, goTown, goWeapons, restart],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run", "Weapons", "Restart"],
    "button functions": [attack, dodge, goTown, goWeapons, restart],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square", "Weapons", "Restart"],
    "button functions": [goTown, goTown, easterEgg, goWeapons, restart],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "Weapons", "Restart"],
    "button functions": [restart, restart, restart, goWeapons, restart],
    text: "You die. &#x2620;"
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "Weapons", "Restart"],
    "button functions": [restart, restart, restart, goWeapons, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?", "Weapons", "Restart"],
    "button functions": [pickTwo, pickEight, goTown, goWeapons, restart],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// Initialize the game
function init() {
  button1.onclick = goStore;
  button2.onclick = goCave;
  button3.onclick = fightDragon;
  button4.onclick = goWeapons;
  button5.onclick = restart;
  
  updateGame();
  goTown();
}

// Update game display
function updateGame() {
  monsterStats.style.display = "none";
  weaponButtonsContainer.style.display = "none";
  
  // Always show all main buttons
  const buttons = [button1, button2, button3, button4, button5];
  buttons.forEach(btn => btn.style.display = "inline-block");
  
  // Update stats display
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
}

// Location-specific updates
function updateLocation(location) {
  text.innerHTML = location.text;
  
  const buttons = [button1, button2, button3, button4];
  buttons.forEach((btn, i) => {
    if (location["button text"][i]) {
      btn.innerText = location["button text"][i];
      btn.onclick = location["button functions"][i];
    }
  });
}

function goTown() {
  updateGame();
  updateLocation(locations[0]);
}

function goStore() {
  updateGame();
  updateLocation(locations[1]);
}

function goCave() {
  updateGame();
  updateLocation(locations[2]);
}

function goWeapons() {
  updateGame();
  weaponButtonsContainer.style.display = "flex";
  text.innerHTML = `You have these weapons: ${inventory.join(", ")}.<br>Select a weapon to equip:`;
  updateWeaponButtons();
}

function updateWeaponButtons() {
  weaponButtonsContainer.innerHTML = "";
  inventory.forEach((weapon, index) => {
    const button = document.createElement("button");
    button.innerText = weapon;
    
    // Highlight the currently equipped weapon
    if (index === currentWeapon) {
      button.style.background = "#4CAF50";
      button.style.color = "white";
    }
    
    button.onclick = () => {
      currentWeapon = index;
      updateWeaponDamage();
      updateWeaponButtons(); // Refresh to show new selection
    };
    weaponButtonsContainer.appendChild(button);
  });
}

function updateWeaponDamage() {
  const weapon = weapons.find(w => w.name === inventory[currentWeapon]);
  if (weapon) {
    text.innerHTML = `You equipped ${inventory[currentWeapon]} (Power: ${weapon.power}).<br>You have these weapons: ${inventory.join(", ")}.`;
  }
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      text.innerText = `You now have a ${newWeapon}.`;
      // Update weapons display immediately
      goWeapons();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let soldWeapon = inventory.pop();
    // Ensure currentWeapon stays within bounds
    currentWeapon = Math.min(currentWeapon, inventory.length - 1);
    text.innerText = `You sold a ${soldWeapon}.`;
    // Update weapons display immediately
    goWeapons();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() { fighting = 0; goFight(); }
function fightBeast() { fighting = 1; goFight(); }
function fightDragon() { fighting = 2; goFight(); }

function goFight() {
  updateGame();
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "flex";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
  updateLocation(locations[3]);
}

function attack() {
  text.innerText = `The ${monsters[fighting].name} attacks. You attack it with your ${inventory[currentWeapon]}.`;
  health -= getMonsterAttackValue(monsters[fighting].level);
  
  if (isMonsterHit()) {
    const weapon = weapons.find(w => w.name === inventory[currentWeapon]);
    monsterHealth -= weapon.power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss.";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.length > 1) {
    text.innerText += ` Your ${inventory.pop()} breaks.`;
    currentWeapon = Math.min(currentWeapon, inventory.length - 1);
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = `You dodge the attack from the ${monsters[fighting].name}`;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  updateLocation(locations[4]);
}

function lose() {
  updateLocation(locations[5]);
}

function winGame() {
  updateLocation(locations[6]);
}

function easterEgg() {
  updateLocation(locations[7]);
}

function pickTwo() { pick(2); }
function pickEight() { pick(8); }

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = `You picked ${guess}. Here are the random numbers:\n${numbers.join("\n")}`;
  if (numbers.includes(guess)) {
    text.innerText += "\nRight! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "\nWrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) lose();
  }
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// Start the game when the page loads
window.onload = init;