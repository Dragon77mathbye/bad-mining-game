let health = 100;
let foodPoints = 100;
let drinkPoints = 100;
let pos = {x: 0, y: 0};
let liquidLocations = [];
let oreLocations = [];
let pickaxe = items.stickPickaxe;
let axe = items.stickAxe;
let flight = false;
let lastSave = localStorage.getItem("lastSave");
let maxHealth = 100;
let maxFood = 100;
let maxDrink = 100;
let mapSize = 81;

function addItemsToOres() {
    for (let i = 0; i < ores.length; i++) {
        if (items[ores[i].id] === undefined || items[ores[i].id] === null) {
            items[ores[i].id] = {
                name: capitalize(camelCaseToRegular(ores[i].id)),
                size: (ores[i].size === undefined || ores[i].size === null) ? 1 : ores[i].size,
                types: (ores[i].commonness === undefined || ores[i].commonness === null) ? [] : ["block"]
            };
            if (ores[i].excludeSize) {
                items[ores[i].id].size = undefined;
            }
        }
        if (ores[i].foundBelow === undefined || ores[i].foundBelow === null) {
            ores[i].foundBelow = Infinity;
        }
        if (ores[i].foundAbove === undefined || ores[i].foundAbove === null) {
            ores[i].foundAbove = Infinity;
        }
    }
}

function itemsUpdate() {
    for (const key in items) {
        if (items[key].types === undefined) {
            items[key].types = [];
        }
    }
    for (let o = 0; o < ores.length; o++) {
        const minHeight = (ores[o].foundAbove !== -Infinity) ? ores[o].foundAbove : -1000000;
        const maxHeight = (ores[o].foundBelow !== Infinity) ? ores[o].foundBelow : 1000000;
        const distanceFrom0 = (Math.abs(ores[o].foundBelow) > Math.abs(ores[o].foundAbove)) ? Math.abs(ores[o].foundAbove) : Math.abs(ores[o].foundBelow);
        const overallCommonness = ores[o].commonness * (maxHeight - minHeight + 1) - distanceFrom0;
        let setRarity;
        if (overallCommonness >= 2000000) {
            setRarity = "Common";
        } else if (overallCommonness >= 60000) {
            setRarity = "Uncommon";
        } else if (overallCommonness >= 15000) {
            setRarity = "Rare";
        } else if (overallCommonness >= 5000) {
            setRarity = "Epic";
        } else if (overallCommonness >= -50000) {
            setRarity = "Legendary";
        } else {
            setRarity = "Mythical";
        }
        if (!(items[ores[o].id].types.includes("block"))) {
            items[ores[o].id].rarity = setRarity;
        }
    }
    for (let j = 0; j < recipes.length; j++) {
        if (items[recipes[j].output.id].size === undefined || items[recipes[j].output.id].size === null) {
            let size = 0;
            for (let i = 0; i < recipes[j].ingredients.length; i++) {
                size += items[recipes[j].ingredients[i].id].size * recipes[j].ingredients[i].count / ((recipes[j].output.count !== 0) ? recipes[j].output.count : 1);
            }
            items[recipes[j].output.id].size = size;
        }
        if (items[recipes[j].output.id].rarity === undefined || items[recipes[j].output.id].rarity === null) {
            const rarities = {undefined: -1, Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4, Mythical: 5};
            let highestRarity = -1;
            for (let i = 0; i < recipes[j].ingredients.length; i++) {
                if (rarities[String(items[recipes[j].ingredients[i].id].rarity)] > highestRarity) {
                    if (rarities[String(items[recipes[j].ingredients[i].id].rarity)] === -1) {
                        itemsUpdate();
                    }
                    highestRarity = rarities[items[recipes[j].ingredients[i].id].rarity];
                }
            }
            items[recipes[j].output.id].rarity = (highestRarity === 5) ? "Mythical" : (highestRarity === 4) ? "Legendary" : (highestRarity === 3) ? "Epic" : (highestRarity === 2) ? "Rare" : (highestRarity === 1) ? "Uncommon" : (highestRarity === 0) ? "Common" : undefined;
        }
    }
    for (let i = 0; i < recipes.length; i++) {
        if (items[recipes[i].output.id].size === undefined || items[recipes[i].output.id].size === null || items[recipes[i].output.id].rarity === undefined || items[recipes[i].output.id].rarity === null) {
            itemsUpdate();
            break;
        }
    }
}

const healthText = document.getElementById("health");
const healthBar = document.getElementById("healthBar");
const inventoryGui = document.getElementById("inventory");
const openInventoryBtn = document.getElementById("openInventory");
let isInventoryOpen = false;
oreLocations[1e9] = [];
oreLocations[1e9][1e9] = "air";
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
        if (recipe.output.function !== undefined && recipe.output.function !== null) {
            recipe.output.function();
            addItem("dirt", 0);
        }
        if (items[recipe.output.id].types.includes("pickaxe") && items[recipe.output.id].strength >= pickaxe.strength) {
            pickaxe = items[recipe.output.id];
        }
        if (items[recipe.output.id].types.includes("axe") && items[recipe.output.id].durability >= axe.durability) {
            axe = items[recipe.output.id];
        }
    }
}

function rarityColor(rarity) {
    if (rarity === "Mythical") {
        return "#08f";
    } else if (rarity === "Legendary") {
        return "#f80";
    } else if (rarity === "Epic") {
        return "#f0f";
    } else if (rarity === "Rare") {
        return "#0ff";
    } else if (rarity === "Uncommon") {
        return "#ff4";
    } else {
        return "#fff";
    }
}

function updateRecipeBook() {
    let output = "";
    for (let r = 0; r < recipes.length; r++) {
        if (checkForIngredients(recipes[r])[0]) {
            const recipe = recipes[r];
            const rarityColor1 = rarityColor(items[recipe.output.id].rarity);
            output += `<button class='recipe' onclick='craft(recipes[${r}]); updateRecipeBook();' oncontextmenu='while (checkForIngredients(recipes[${r}])[0]) {craft(recipes[${r}]); updateRecipeBook();}'><p style="color: ${rarityColor1};">${items[String(recipe.output.id)].name} (${recipe.output.count})</p>`;
            for (let c = 0; c < recipe.ingredients.length; c++) {
                const rarity = items[recipe.ingredients[c].id].rarity;
                let color = rarityColor(rarity);
                output += `<p class='recipeIngredient' style="color: ${color};">${items[recipe.ingredients[c].id].name} (${(recipe.ingredients[c].count > 0) ? recipe.ingredients[c].count : "1"})</p>`;
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

function isLiquid(x, y) {
    x += 1e9;
    y += 1e9;
    for (let i = 0; i < ores.length; i++) {
        if (ores[i].id === oreLocations[x][y]) {
            if (ores[i].types !== undefined) {
                return ores[i].types.includes("liquid");
            } else {
                return false;
            }
        }
    }
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
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9] === undefined || oreLocations[pos.x + 1e9] === null || oreLocations[pos.x + 1e9][pos.y + 1e9] === null) {
        generateOre(pos.x, pos.y);
    }
    if (oreLocations[pos.x + 1e9 - 1] === undefined || oreLocations[pos.x + 1e9 - 1][pos.y + 1e9] === undefined || oreLocations[pos.x + 1e9 - 1] === null || oreLocations[pos.x + 1e9 - 1][pos.y + 1e9] === null) {
        generateOre(pos.x - 1, pos.y);
    }
    if (oreLocations[pos.x + 1e9 + 1] === undefined || oreLocations[pos.x + 1e9 + 1][pos.y + 1e9] === undefined || oreLocations[pos.x + 1e9 + 1] === null || oreLocations[pos.x + 1e9 + 1][pos.y + 1e9] === null) {
        generateOre(pos.x + 1, pos.y);
    }
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9 - 1] === undefined || oreLocations[pos.x + 1e9] === null || oreLocations[pos.x + 1e9][pos.y + 1e9 - 1] === null) {
        generateOre(pos.x, pos.y - 1);
    }
    if (oreLocations[pos.x + 1e9] === undefined || oreLocations[pos.x + 1e9][pos.y + 1e9 + 1] === undefined || oreLocations[pos.x + 1e9] === null || oreLocations[pos.x + 1e9][pos.y + 1e9 + 1] === null) {
        generateOre(pos.x, pos.y + 1);
    }
    let canMine = false;
    for (let i = 0; i < ores.length; i++) {
        if (oreLocations[pos.x + 1e9] !== undefined && oreLocations[pos.x + 1e9] !== null && ores[i].id === oreLocations[pos.x + 1e9][pos.y + 1e9] && pickaxe.strength >= ores[i].hardness) {
            canMine = true;
            if (oreLocations[pos.x + 1e9][pos.y + 1e9] !== "air" && !isLiquid(pos.x, pos.y)) {
                addItem(oreLocations[pos.x + 1e9][pos.y + 1e9], 1);
                for (let i = 0; i < ores.length; i++) {
                    if (ores[i].id === oreLocations[pos.x + 1e9][pos.y + 1e9]) {
                        if (!(ores[i].deadliness === undefined || ores[i].deadliness === null)) {
                            health -= ores[i].deadliness;
                            healthText.innerHTML = `${Math.round(health).toLocaleString()} HP`;
                            healthBar.style.width = `${health}%`;
                            if (health <= 0) {
                                die(`You were killed by ${capitalize(camelCaseToRegular(ores[i].id))}`);
                            }
                        }
                        break;
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
    document.getElementById("altitude").innerText = `Altitude: ${simplify(pos.y)} ft | Position: ${(pos.x >= 0) ? simplify(pos.x) + " ft" + " east" : simplify(-pos.x) + " ft" + " west"}`;
}

function buildBelow() {
    let placed = false;
    if (!flight) {
        for (let i = 0; i < inventory.length; i++) {
            if (items[inventory[i].id].types.includes("block") && inventory[i].count.gten(1)) {
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
    const ctx = document.getElementById("map").getContext("2d");
    const squareSize = 810 / mapSize;
    ctx.clearRect(0, 0, 810, 810);
    ctx.rect(0, 0, 810, 810);
    ctx.stroke();
    for (let x = pos.x + 1e9 - (mapSize / 2 - 0.5); x < pos.x + 1e9 + (mapSize / 2 - 0.5); x++) {
        for (let y = pos.y + 1e9 - (mapSize / 2 - 0.5); y < pos.y + 1e9 + (mapSize / 2 - 0.5); y++) {
            if (oreLocations[x] !== undefined && oreLocations[x][y] !== undefined) {
                for (let i = 0; i < ores.length; i++) {
                    if (ores[i].id === oreLocations[x][y]) {
                        ctx.fillStyle = ores[i].color;
                        break;
                    }
                }
                ctx.fillRect((x - pos.x - 1e9) * squareSize + 400, 810 - ((y - pos.y - 1e9) * squareSize + 400), squareSize, squareSize);
                ctx.fillStyle = "#ff0";
                ctx.beginPath();
                ctx.arc(400 + squareSize / 2, 410 + squareSize / 2, squareSize / 2.5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
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
    if (oreLocations[x + 1e9] === undefined || oreLocations[x + 1e9] === null) {
        oreLocations[x + 1e9] = [];
    }
    oreLocations[x + 1e9][y + 1e9] = ore.id;
    if (isLiquid(x, y) && !liquidLocations.includes(`${x},${y} ♸${oreLocations[x + 1e9][y + 1e9]}♸`)) liquidLocations.push(`${x},${y} ♸${oreLocations[x + 1e9][y + 1e9]}♸`);
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

function exportSave() {
    let output = {};
    output.inventory = inventory;
    output.pickaxe = pickaxe;
    output.axe = axe;
    output.maxSize = maxSize;
    output.health = health;
    output.foodPoints = foodPoints;
    output.drinkPoints = drinkPoints;
    output.mapSize = mapSize;
    output.flight = flight;
    output.items = items;
    output.recipes = recipes;
    output.ores = ores;

    navigator.clipboard.writeText(btoa(JSON.stringify(output))).then(() => {
        alert("Copied save to clipboard! (Auto-adds modded items, ores, and recipes, but it is still recommended to load mods again before importing save data.");
        lastSave = Date.now();
    }, () => {
        alert("Save failed! Try again later, or report it at https://github.com/Dragon77mathbye/bad-mining-game/issues");
    });
    localStorage.setItem("lastSave", lastSave);
}

function importSave() {
    const save = prompt("Save?");
    let input = JSON.parse(atob(save));
    inventory = input.inventory;
    for (let i = 0; i < inventory.length; i++) {
        inventory[i].count = new hugeNumber(inventory[i].count);
    }
    pickaxe = input.pickaxe;
    axe = input.axe;
    maxSize = input.maxSize;
    health = input.health;
    foodPoints = input.foodPoints;
    drinkPoints = input.drinkPoints;
    mapSize = input.mapSize;
    flight = input.flight;
    items = input.items;
    ores = input.ores;
    recipes = input.recipes;
    addItemsToOres();
    itemsUpdate();
    updateRecipeBook();
    updateInventory();
}

function updateInventory() {
    let totalSize = new hugeNumber(0);
    for (let i = 0; i < inventory.length; i++) {
        totalSize = totalSize.add(inventory[i].count.number() * items[String(inventory[i].id)].size);
    }
    let output = "";
    inventory.sort(function (a, b) {
        let textA = a.id.toUpperCase();
        let textB = b.id.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    for (let i = 0; i < inventory.length; i++) {
        if (Math.round(inventory[i].count.number() * 10000) / 10000 > 0) {
            const itemSize = simplify(inventory[i].count.number() * items[String(inventory[i].id)].size);
            let message;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                message = "<p class='clickToDrop'>Tap to drop one<br>Hold to drop all</p>";
            } else {
                message = "<p class='clickToDrop'>Click to drop one<br>Right click to drop all</p>";
            }
            output += `<fieldset class='inventoryItem' onclick='addItem("${inventory[i].id}", -1);' oncontextmenu='addItem("${inventory[i].id}", ${-inventory[i].count.number()}); updateRecipeBook();'><p>${items[inventory[i].id].name}</p>${message}<p class='inventoryItemCount'>${simplify(inventory[i].count)} (${itemSize} lbs | ${(itemSize >= (maxSize * 0.5)) ? "Very Heavy" : (itemSize >= (maxSize * 0.25)) ? "Heavy" : (itemSize >= (maxSize * 0.1)) ? "Medium" : (itemSize >= (maxSize * 0.05)) ? "Light" : (itemSize >= (maxSize * 0.001)) ? "Very Light" : "Weightless"})</p></fieldset>`;
        } else {
            inventory[i].count = new hugeNumber(0);
        }
    }
    document.getElementById("inventory").innerHTML = `<legend>Inventory (${toNumberName(totalSize, true, 0)} / ${simplify(maxSize)} lbs full)</legend>${output}<div style='clear: both'></div>`;
}

function die(deathMessage) {
    if (deathMessage === undefined || deathMessage === null) {
        deathMessage = "";
    }
    health = 100;
    foodPoints = 100;
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

function godMode() {
    flight = true;
    pickaxe.durability = Infinity;
    pickaxe.strength = Infinity;
    axe.durability = Infinity;
    maxSize = Infinity;
    health = Infinity;
    foodPoints = Infinity;
    for (let i = 0; i < Object.keys(items).length; i++) {
        addItem(Object.keys(items)[i], 1e300);
    }
    updateRecipeBook();
}

function addBlocks(json) {
    ores = ores.concat(json);
    addItemsToOres();
}

function addItems(json) {
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
        items[keys[i]] = json[keys[i]];
    }
}

function addRecipes(json) {
    recipes = recipes.concat(json);
    itemsUpdate();
}

function addMaterial(id, power, size, hasOre, hasBar, hasBlock, low, high) {
    const hardness = power / 10;
    const recipeCost = Math.round(power / 16);
    if (low === undefined) {
        low = -20000000;
    }
    if (high === undefined) {
        high = Math.round(-(1.25 ** power));
    }
    if (hasOre) {
        addBlocks([
            {
                id: id,
                commonness: 100 - power,
                hardness: hardness,
                foundAbove: low,
                foundBelow: high
            }
        ]);
    }
    eval(`addItems({${id}: {name: capitalize(camelCaseToRegular(id)), size: size}});`);
    eval(`addItems({
        ${id}Pickaxe: {
            name: capitalize(camelCaseToRegular(id + "Pickaxe")),
            strength: (hardness < 10) ? hardness + 1 : 10,
            types: ["pickaxe"]
        }
    });`);
    eval(`addItems({${id}Axe: {name: capitalize(camelCaseToRegular(id + "Axe")), types: ["axe"]}});`);
    if (hasBlock) {
        addBlocks([
            {
                id: `${id}Block`,
                hardness: hardness
            }
        ]);
        eval(`addItems({${id}Block: {name: capitalize(camelCaseToRegular(id)) + " Block", size: size * 4}});`);
        addRecipes([
            {
                ingredients: [
                    {
                        id: id,
                        count: 4
                    }
                ],
                output: {
                    id: `${id}Block`,
                    count: 1
                }
            },
            {
                ingredients: [
                    {
                        id: `${id}Block`,
                        count: 1
                    }
                ],
                output: {
                    id: id,
                    count: 4
                }
            }
        ]);
    }
    if (hasBar) {
        eval(`addItems({${id}Bar: {name: capitalize(camelCaseToRegular(id + "Bar")), size: size * 2}});`);
        addRecipes([
            {
                ingredients: [
                    {
                        id: id,
                        count: 2
                    },
                    {
                        id: "coal",
                        count: Math.floor(recipeCost / 2)
                    }
                ],
                output: {
                    id: `${id}Bar`,
                    count: 1
                }
            },
            {
                ingredients: [
                    {
                        id: `${id}Bar`,
                        count: recipeCost
                    },
                    {
                        id: "stick",
                        count: Math.round(recipeCost * 0.75)
                    }
                ],
                output: {
                    id: `${id}Pickaxe`,
                    count: 1
                }
            },
            {
                ingredients: [
                    {
                        id: `${id}Bar`,
                        count: recipeCost
                    },
                    {
                        id: "stick",
                        count: Math.round(recipeCost * 0.75)
                    }
                ],
                output: {
                    id: `${id}Axe`,
                    count: 1
                }
            }
        ]);
    } else {
        addRecipes([
            {
                ingredients: [
                    {
                        id: id,
                        count: recipeCost
                    },
                    {
                        id: "stick",
                        count: Math.round(recipeCost * 0.75)
                    }
                ],
                output: {
                    id: `${id}Pickaxe`,
                    count: 1
                }
            },
            {
                ingredients: [
                    {
                        id: id,
                        count: recipeCost
                    },
                    {
                        id: "stick",
                        count: Math.round(recipeCost * 0.75)
                    }
                ],
                output: {
                    id: `${id}Axe`,
                    count: 1
                }
            }
        ]);
    }
    reload();
}

function rename(id, name) {
    items[id].name = name;
}

function changeId(oldId, newId) {
    items[newId] = items[oldId];
    delete items[oldId];
    for (let i = 0; i < recipes.length; i++) {
        for (let j = 0; j < recipes[i].ingredients.length; j++) {
            if (recipes[i].ingredients[j].id === oldId) {
                recipes[i].ingredients[j].id = newId;
            }
        }
    }
}

function updateCheatSheets() {
    let output = "<legend>Recipe Cheat Sheet</legend>";
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        output += `<fieldset class="recipe"><p style="color: ${rarityColor(items[recipe.output.id].rarity)}">${items[String(recipe.output.id)].name} (${recipe.output.count})</p>`;
        for (let c = 0; c < recipe.ingredients.length; c++) {
            const color = rarityColor(items[recipe.ingredients[c].id].rarity);
            output += `<p class='recipeIngredient' style="color: ${color};">${items[recipe.ingredients[c].id].name} (${(recipe.ingredients[c].count > 0) ? recipe.ingredients[c].count : "1"})</p>`;
        }
        output += `</fieldset>`;
    }
    document.getElementById("recipeCheatSheet").innerHTML = output.replaceAll("undefined", "");

    output = "<legend>Ore Cheat Sheet</legend>";
    for (let i = 0; i < ores.length; i++) {
        if (ores[i].commonness !== undefined && ores[i].commonness !== null) {
            let heightRange;
            if (ores[i].foundAbove === -Infinity) {
                heightRange = `Below ${ores[i].foundBelow} ft`;
            } else if (ores[i].foundBelow === Infinity) {
                heightRange = `Above ${ores[i].foundAbove} ft`;
            } else {
                heightRange = `${ores[i].foundAbove} ft to ${ores[i].foundBelow} ft`;
            }
            output += `<fieldset class="recipe"><p><b>${items[ores[i].id].name}</b></p><p>Hardness: ${ores[i].hardness}</p><p>Commonness: ${ores[i].commonness}</p><p>Obtainable Height Range: ${heightRange}</p></fieldset>`;
        }
    }
    document.getElementById("oreCheatSheet").innerHTML = output.replaceAll(undefined, "");
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
                if (text[i].output.function !== undefined && text[i].output.function !== null) {
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
    reload();
}

function reload() {
    addItemsToOres();
    itemsUpdate();
    updateCheatSheets();
    updateInventory();
}

async function loadScript(script) {
    eval(await script.text());
    reload();
}

function navigateTo(location) {
    const locations = ["main", "options"];
    for (let i = 0; i < locations.length; i++) {
        if (locations[i] === location) {
            document.getElementById(locations[i]).style.display = "";
        } else {
            document.getElementById(locations[i]).style.display = "none";
        }
    }
}

function secondsToOtherUnits(n) {
    if (typeof n === "number") {
        if (n < 60) {
            return `${Math.floor(n)} sec`;
        } else if (n < 3600) {
            return `${Math.floor(n / 60)} min`;
        } else if (n < 172800) {
            return `${Math.floor(n / 3600)} hr`;
        } else if (n < 315576000) {
            return `${Math.floor(n / 86400)} d`;
        } else {
            return `${Math.floor(n / 31557600)} yr`;
        }
    } else {
        return n;
    }
}

reload();

setInterval(() => {
    // Health System
    if (health < 100 && foodPoints >= 10) health++;
    if (health <= 0) die();
    if (health > maxHealth) health = maxHealth;

    if (foodPoints <= 0) {
        health--;
        if (health <= 0) die("You starved to death!");
    }
    if (foodPoints > maxFood) foodPoints = maxFood;
    if (foodPoints >= 0) foodPoints -= 0.1;

    if (drinkPoints > maxDrink) drinkPoints = maxDrink;
    if (drinkPoints >= 0) drinkPoints -= 0.15;
    if (drinkPoints <= 0) {
        health -= 5;
        if (health <= 0) die("You died of dehydration!");
    }

    healthText.innerHTML = `${Math.round(health).toLocaleString()}/${Math.round(maxHealth).toLocaleString()} HP`;
    healthBar.style.width = `${health / maxHealth * 100}%`;
    document.getElementById("food").innerHTML = `${Math.abs(Math.round(foodPoints)).toLocaleString()}/${Math.abs(Math.round(maxFood)).toLocaleString()} FP`;
    document.getElementById("foodBar").style.width = `${foodPoints / maxFood * 100}%`;
    document.getElementById("drink").innerHTML = `${Math.abs(Math.round(drinkPoints)).toLocaleString()}/${Math.abs(Math.round(maxDrink)).toLocaleString()} DP`;
    document.getElementById("drinkBar").style.width = `${drinkPoints / maxDrink * 100}%`;

    const lastSaveRelative = (String(localStorage.getItem("lastSave")) !== "null") ? (Date.now() - lastSave) / 1000 : "never";
    document.getElementById("exportSave").innerText = `Export Save (Last saved ${secondsToOtherUnits(lastSaveRelative)} ago)`;
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

let liquids = [];
for (let i = 0; i < ores.length; i++) {
    if (ores[i].types.includes("liquid")) {
        liquids.push(ores[i].id);
    }
}

for (let i = 0; i < liquids.length; i++) {
    setInterval(() => {
        // TODO Liquid Physics
        /* if air below then move liquid down
        if air left then if air right then move liquid one random way otherwise move left
        if air right then move right
        remove old liquid loc
        add new liquid loc
         */
        for (let j = 0; j < liquidLocations.length; j++) {
            if (liquidLocations[j].match(RegExp(`♸${liquids[i]}♸`)) !== null) {
                let x = Number(liquidLocations[j].split(",")[0].split(" ")[0]);
                let y = Number(liquidLocations[j].split(",")[1].split(" ")[0]);
                if (oreLocations[x + 1e9 + 1] === undefined) {
                    oreLocations[x + 1e9 + 1] = [];
                }
                if (oreLocations[x + 1e9 - 1] === undefined) {
                    oreLocations[x + 1e9 - 1] = [];
                }
                if (oreLocations[x + 1e9] === undefined) {
                    oreLocations[x + 1e9] = [];
                }
                if (oreLocations[x + 1e9][y + 1e9 - 1] === "air") {
                    oreLocations[x + 1e9][y + 1e9 - 1] = liquids[i];
                    oreLocations[x + 1e9][y + 1e9] = "air";
                    liquidLocations[j] = `${Number(liquidLocations[j].split(",")[0])},${Number(liquidLocations[j].split(",")[1].split(" ")[0]) - 1} ${liquidLocations[j].split(" ")[1]}`;
                } else if (oreLocations[x + 1e9 + 1][y + 1e9] === "air" && oreLocations[x + 1e9 - 1][y + 1e9] === "air") {
                    liquidLocations.splice(j, 1);
                } else if (oreLocations[x + 1e9 + 1][y + 1e9] === "air") {
                    oreLocations[x + 1e9 + 1][y + 1e9] = liquids[i];
                    oreLocations[x + 1e9][y + 1e9] = "air";
                    liquidLocations[j] = `${Number(liquidLocations[j].split(",")[0]) + 1},${Number(liquidLocations[j].split(",")[1].split(" ")[0])} ${liquidLocations[j].split(" ")[1]}`;
                } else if (oreLocations[x + 1e9 - 1][y + 1e9] === "air") {
                    oreLocations[x + 1e9 - 1][y + 1e9] = liquids[i];
                    oreLocations[x + 1e9][y + 1e9] = "air";
                    liquidLocations[j] = `${Number(liquidLocations[j].split(",")[0]) - 1},${Number(liquidLocations[j].split(",")[1].split(" ")[0])} ${liquidLocations[j].split(" ")[1]}`;
                } else {
                    liquidLocations.splice(j, 1);
                }
            }
            updateVision();
        }
    }, liquids[i].viscosity);
}