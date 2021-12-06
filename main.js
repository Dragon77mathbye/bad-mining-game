let health = 100;
let pos = {x: 0, y: 0};
let oreLocations = [];
let pickaxe = items.stickPickaxe;
let axe = items.stickAxe;
let flight = false;
let text;

function addItemsToOres() {
    for (let i = 0; i < ores.length; i++) {
        if (items[ores[i].id] === undefined) {
            console.log(`Adding item to ore with id: ${i}`);
            items[ores[i].id] = {
                name: capitalize(camelCaseToRegular(ores[i].id)),
                size: (ores[i].size === undefined) ? 1 : ores[i].size
            };
        }
        if (ores[i].foundBelow === undefined) {
            ores[i].foundBelow = Infinity;
        }
        if (ores[i].foundAbove === undefined) {
            ores[i].foundAbove = Infinity;
        }
    }
}

function sizeOfItemsUpdate() {
    for (let j = 0; j < recipes.length; j++) {
        console.log(`Updating item size with recipe id: ${j}`);
        if (items[recipes[j].output.id].size === undefined) {
            let size = 0;
            for (let i = 0; i < recipes[j].ingredients.length; i++) {
                size += items[recipes[j].ingredients[i].id].size * recipes[j].ingredients[i].count / ((recipes[j].output.count !== 0) ? recipes[j].output.count : 1);
            }
            items[recipes[j].output.id].size = size;
        }
    }
    for (let i = 0; i < recipes.length; i++) {
        if (items[recipes[i].output.id].size === undefined) {
            sizeOfItemsUpdate();
            break;
        }
    }
}

addItemsToOres();
sizeOfItemsUpdate();
const healthText = document.getElementById("health");
const healthBar = document.getElementById("healthBar");
const inventoryGui = document.getElementById("inventory");
const openInventoryBtn = document.getElementById("openInventory");
let isInventoryOpen = false;
generateOre(pos.x - 1, pos.y);
generateOre(pos.x + 1, pos.y);
generateOre(pos.x, pos.y - 1);
generateOre(pos.x, pos.y + 1);
if (localStorage.getItem("inventoryHTML") !== null) {
    document.getElementById("inventory").innerHTML = localStorage.getItem("inventoryHTML");
}
if (localStorage.getItem("recipesHTML") !== null) {
    document.getElementById("recipes").innerHTML = localStorage.getItem("recipesHTML");
}

function start() {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('main').style.display = '';
    document.getElementById('music').play();
    document.getElementById('music').volume = 0.5;
    addItem("airBlock", 100);
}

function openInventory() {
    isInventoryOpen = true;
    inventoryGui.style.display = "";
    document.getElementById("recipes").style.display = "";
    openInventoryBtn.style.display = "none";
    document.getElementById("closeInventory").style.display = "";
}

function closeInventory() {
    isInventoryOpen = false;
    inventoryGui.style.display = "none";
    document.getElementById("recipes").style.display = "none";
    openInventoryBtn.style.display = "";
    document.getElementById("closeInventory").style.display = "none";
}

function craft(recipe) {
    const canCraft = checkForIngredients(recipe);
    if (canCraft[0]) {
        for (let i = 1; i < canCraft.length; i++) {
            addItem(canCraft[i].id, -canCraft[i].count);
        }
        addItem(recipe.output.id, recipe.output.count);
        if (recipe.output.function !== undefined) {
            recipe.output.function();
            addItem("dirt", 0);
        }
        if (items[recipe.output.id].type === "pickaxe" && items[recipe.output.id].strength >= pickaxe.strength) {
            pickaxe = items[recipe.output.id];
        }
        if (items[recipe.output.id].type === "axe" && items[recipe.output.id].durability >= axe.durability) {
            axe = items[recipe.output.id];
        }
    }
}

function updateRecipeBook() {
    let output = "";
    for (let r = 0; r < recipes.length; r++) {
        if (checkForIngredients(recipes[r])[0]) {
            const recipe = recipes[r];
            output += `<button class='recipe' onclick='craft(recipes[${r}]); updateRecipeBook();' oncontextmenu='while (checkForIngredients(recipes[${r}])[0]) {craft(recipes[${r}]); updateRecipeBook();}'><p>${items[String(recipe.output.id)].name} (${recipe.output.count})</p>`;
            for (let c = 0; c < recipe.ingredients.length; c++) {
                output += `<p class='recipeIngredient'>${items[recipe.ingredients[c].id].name} (${(recipe.ingredients[c].count > 0) ? recipe.ingredients[c].count : "1"})</p>`;
            }
            output += "</button>";
        }
    }
    document.getElementById("recipes").innerHTML = "<legend>Recipe Book</legend>" + String(output).replace("undefined", "");
}

function checkForIngredients(recipe) {
    let availableIngredients = [];
    for (let i = 0; i < recipe.ingredients.length; i++) {
        for (let j = 0; j < inventory.length; j++) {
            if (inventory[j].id === recipe.ingredients[i].id && inventory[j].count.gten(recipe.ingredients[i].count)) {
                availableIngredients.push({id: recipe.ingredients[i].id, count: recipe.ingredients[i].count});
            }
        }
    }
    availableIngredients.unshift(availableIngredients.length >= recipe.ingredients.length);
    return availableIngredients;
}

function move(direction) {
    if (direction === "l") {
        pos.x--;
    } else if (direction === "r") {
        pos.x++;
    } else if (direction === "u") {
        pos.y++;
    } else if (direction === "d") {
        pos.y--;
    }
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9] === undefined) {
        generateOre(pos.x, pos.y);
    }
    if (oreLocations[pos.x + 1e9 - 1] === undefined || oreLocations[pos.x + 1e9 - 1][pos.y + 1e9] === undefined) {
        generateOre(pos.x - 1, pos.y);
    }
    if (oreLocations[pos.x + 1e9 + 1] === undefined || oreLocations[pos.x + 1e9 + 1][pos.y + 1e9] === undefined) {
        generateOre(pos.x + 1, pos.y);
    }
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9 - 1] === undefined) {
        generateOre(pos.x, pos.y - 1);
    }
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9 + 1] === undefined) {
        generateOre(pos.x, pos.y + 1);
    }
    let canMine = false;
    for (let i = 0; i < ores.length; i++) {
        if (oreLocations[pos.x + 1e9] !== undefined && ores[i].id === oreLocations[pos.x + 1e9][pos.y + 1e9] && pickaxe.strength >= ores[i].hardness) {
            canMine = true;
            if (oreLocations[pos.x + 1e9][pos.y + 1e9] !== "air") {
                addItem(oreLocations[pos.x + 1e9][pos.y + 1e9], 1);
                for (let i = 0; i < ores.length; i++) {
                    if (ores[i].id === oreLocations[pos.x + 1e9][pos.y + 1e9]) {
                        if (ores[i].deadliness === undefined) {
                            break;
                        } else {
                            health -= ores[i].deadliness;
                            healthText.innerHTML = `${Math.round(health).toLocaleString()} HP`;
                            healthBar.style.width = `${health}%`;
                            if (health <= 0) {
                                die(`You were killed by ${capitalize(camelCaseToRegular(ores[i].id))}`);
                            }
                            break;
                        }
                    }
                }
                oreLocations[pos.x + 1e9][pos.y + 1e9] = "air";
                updateRecipeBook();
            }
        }
    }
    if (!canMine) {
        if (direction === "l") {
            pos.x++;
        } else if (direction === "r") {
            pos.x--;
        } else if (direction === "u") {
            pos.y--;
        } else if (direction === "d") {
            pos.y++;
        }
    } else {
        if (direction === "u") {
            buildBelow();
        }
    }
    updateVision();
    document.body.style.backgroundColor = `hsl(${193 + Math.abs(pos.y) / 1000}, ${100 + pos.y / 100}%, ${50 - Math.abs(pos.y) / 1000}%)`;
    document.getElementById("altitude").innerText = `Altitude: ${pos.y} ft | Position: ${(pos.x >= 0) ? pos.x + " ft" + " east" : -pos.x + " ft" + " west"}`;
}

function buildBelow() {
    let placed = false;
    if (!flight) {
        for (let i = 0; i < inventory.length; i++) {
            if (items[inventory[i].id].type === "block" && inventory[i].count.gten(1)) {
                oreLocations[pos.x + 1e9][pos.y + 1e9 - 1] = inventory[i].id;
                addItem(inventory[i].id, -1);
                placed = true;
                break;
            }
        }
    } else {
        placed = true;
    }
    return placed;
}

function updateVision() {
    document.getElementById("left").innerText = `Left: ${items[oreLocations[pos.x + 1e9 - 1][pos.y + 1e9]].name}`;
    document.getElementById("right").innerText = `Right: ${items[oreLocations[pos.x + 1e9 + 1][pos.y + 1e9]].name}`;
    document.getElementById("up").innerText = `Up: ${items[oreLocations[pos.x + 1e9][pos.y + 1e9 + 1]].name}`;
    document.getElementById("down").innerText = `Down: ${items[oreLocations[pos.x + 1e9][pos.y + 1e9 - 1]].name}`;
}

function capitalize(word) {
    const allWords = word.split(" ");
    for (let i = 0; i < allWords.length; i++) {
        const firstLetter = allWords[i].slice(0, 1);
        allWords[i] = firstLetter.toUpperCase() + allWords[i].slice(1);
    }
    return allWords.join(" ");
}

function uncapitalize(word) {
    const allWords = word.split(" ");
    for (let i = 0; i < allWords.length; i++) {
        const firstLetter = allWords[i].slice(0, 1);
        allWords[i] = firstLetter.toLowerCase() + allWords[i].slice(1);
    }
    return allWords.join(" ");
}

function camelCase(string) {
    const allWords1 = string.split(" ");
    for (let i = 1; i < allWords1.length; i++) {
        allWords1[i] = capitalize(allWords1[i]);
    }
    return allWords1.join("");
}

function camelCaseToRegular(string) {
    while (/[A-Z]/.test(string)) {
        const index = string.match(/[A-Z]/).index;
        const part1 = string.slice(0, index);
        const part2 = string.slice(index);
        string = `${uncapitalize(part1)} ${uncapitalize(part2)}`;
    }
    return string;
}

function generateOre(x, y) {
    let ore;
    let possibleOres = [];
    let maxCommonness = 0;
    for (let o = 0; o < ores.length; o++) {
        if (y >= ores[o].foundAbove && y <= ores[o].foundBelow) {
            const possibleOreLength = possibleOres.length;
            possibleOres.push(ores[o]);
            maxCommonness += ores[o].commonness;
            possibleOres[possibleOreLength].common = maxCommonness;
        }
    }
    const randomNumber = Math.random() * maxCommonness;
    for (let i = 0; i < possibleOres.length; i++) {
        if (randomNumber < possibleOres[i].common) {
            ore = possibleOres[i];
            break;
        }
    }
    if (oreLocations[x + 1e9] === undefined) {
        oreLocations[x + 1e9] = [];
    }
    oreLocations[x + 1e9][y + 1e9] = ore.id;
}

document.onkeydown = (e) => {
    if (e.keyCode === 69) {
        if (isInventoryOpen) {
            closeInventory();
        } else {
            openInventory();
        }
    } else if (e.keyCode === 38 || e.keyCode === 87) {
        move("u");
    } else if (e.keyCode === 40 || e.keyCode === 83) {
        move("d");
    } else if (e.keyCode === 37 || e.keyCode === 65) {
        move("l");
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        move("r");
    }
}

/* function save() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("inventoryHTML", document.getElementById("inventory").innerHTML);
    localStorage.setItem("recipesHTML", document.getElementById("recipes").innerHTML);
    localStorage.setItem("maxSize", String(maxSize));
} */

function die(deathMessage) {
    if (deathMessage === undefined) {
        deathMessage = "";
    }
    health = 100;
    inventory = [];
    pos = {x: 0, y: 0};
    addItem("dirt", 1);
    addItem("dirt", -1);
    document.getElementById("main").style.display = "none";
    document.getElementById("deathMessage").style.display = "";
    document.getElementById("deathMessageText").innerHTML = deathMessage;
    document.body.style.backgroundColor = "darkred";
    updateRecipeBook();
}

function ruinTheFun() {
    flight = true;
    pickaxe.durability = Infinity;
    pickaxe.strength = Infinity;
    axe.durability = Infinity;
    maxSize = Infinity;
    health = Infinity;
    for (let i = 0; i < Object.keys(items).length; i++) {
        addItem(Object.keys(items)[i], 1e300);
    }
    updateRecipeBook();
}

function addBlocks(json) {
    ores = ores.concat(json);
}

function addItems(json) {
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
        items[keys[i]] = json[keys[i]];
    }
}

function addRecipes(json) {
    recipes = recipes.concat(json);
}

async function loadMod(mod, variable) {
    let add = false;
    let text;
    if (variable !== "other") {
        add = confirm("Add to current variable? (OK for appending, Cancel to replace)");
        text = JSON.parse(await mod.text());
    }
    const scriptText = await mod.text();
    if (!add) {
        eval(`${variable} = text`);
    } else {
        if (variable === "items") {
            const keys = Object.keys(text);
            for (let i = 0; i < keys.length; i++) {
                items[keys[i]] = text[keys[i]];
            }
        } else if (variable === "recipes") {
            for (let i = 0; i < text.length; i++) {
                if (text[i].output.function !== undefined) {
                    text[i].output.function = eval(text[i].output.function);
                }
            }
            recipes = recipes.concat(text);
        } else if (variable === "ores") {
            ores = ores.concat(text);
        } else if (variable === "other") {
            eval(scriptText);
        }
    }
    addItemsToOres();
    sizeOfItemsUpdate();
}

async function loadScript(script) {
    eval(await script.text());
    addItemsToOres();
    sizeOfItemsUpdate();
}

setInterval(() => {
    // Healing
    if (health < 100) {
        health++;
    }
    if (health <= 0) {
        die();
    }
    if (health > 100) {
        health = 100;
    }
    healthText.innerHTML = `${Math.round(health).toLocaleString()} HP`;
    healthBar.style.width = `${health}%`;
    // save();
}, 1000);

setInterval(() => {
    if (oreLocations[pos.x + 1e9][pos.y + 1e9 - 1] === "air") {
        let placed;
        if (flight) {
            placed = true;
        } else {
            placed = buildBelow();
        }
        if (!placed) {
            move("d");
        }
    }
    updateVision();
}, 1);