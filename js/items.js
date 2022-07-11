let ores = [
    {
        id: "space",
        hardness: 0,
        commonness: 1e-300,
        maxY: Infinity,
        minY: -Infinity,
        color: "#0000",
        types: ["notSolid"]
    },
    {
        id: "air",
        hardness: 0,
        commonness: 100,
        maxY: 39000,
        minY: 1,
        color: "#fff0",
        types: ["notSolid"]
    },
    {id: "cloud", hardness: 0.5, commonness: 80, maxY: Infinity, minY: 300, veinSize: 25, color: "#ffffff"},
    {id: "dirt", hardness: 0.5, commonness: 90, maxY: 0, minY: -20739440, color: "#3d291d"},
    {id: "log", hardness: 1, commonness: 6, maxY: 10, minY: 1, color: "#361e0d", veinSize: 5},
    {id: "leaves", hardness: 1, commonness: 6, maxY: 10, minY: 1, color: "#5a7a36", veinSize: 10},
    {id: "apple", hardness: 1, commonness: 2, maxY: 10, minY: 1, color: "#ff0000", veinSize: 1},
    {id: "stick", hardness: 1, commonness: 6, maxY: 10, minY: 1, color: "#4a2d18"},
    {id: "stone", hardness: 2, commonness: 1000, maxY: 0, minY: -20739840, color: "#474747", veinSize: 40},
    {id: "granite", hardness: 2, commonness: 70, maxY: 0, minY: -44000, color: "#7e5d5d"},
    {id: "andesite", hardness: 2, commonness: 70, maxY: 0, minY: -44000, color: "#ababab"},
    {id: "diorite", hardness: 2, commonness: 70, maxY: 0, minY: -44000, color: "#dbdbdb"},
    {id: "pumice", hardness: 2, commonness: 70, maxY: 0, minY: -44000, color: "#a19d3d"},
    {id: "talc", hardness: 2, commonness: 40, maxY: -3, minY: -10000000, color: "#607054"},
    {id: "coal", hardness: 2, commonness: 60, maxY: 0, minY: -Infinity, color: "#281f1b"},
    {id: "limonite", hardness: 3, commonness: 50, maxY: -5, minY: -Infinity, color: "#9b5632"},
    {id: "copper", hardness: 3, commonness: 45, maxY: -38, minY: -Infinity, color: "#ff7300"},
    {id: "chromite", hardness: 3, commonness: 50, maxY: -250, minY: -13300, color: "#a1fff2"},
    {id: "petrifiedWood", hardness: 3, commonness: 5, maxY: -500, minY: -35000, color: "#856b4b"},
    {id: "cassiterite", hardness: 4, commonness: 45, maxY: -64, minY: -Infinity, color: "#a4b7bb"},
    {id: "silver", hardness: 4, commonness: 40, maxY: -210, minY: -900, color: "#beffff"},
    {id: "titanite", hardness: 4, commonness: 42, maxY: -1600, minY: -3700000, color: "#7496f5"},
    {id: "gold", hardness: 4, commonness: 30, maxY: -4100, minY: -5300, color: "#ffd500"},
    {id: "hematite", hardness: 5, commonness: 40, maxY: -16000, minY: -18000, color: "#25004d"},
    {id: "apatite", hardness: 5, commonness: 40, maxY: -24000, minY: -24000, color: "#7332c2"},
    {id: "barite", hardness: 6, commonness: 20, maxY: -24000, minY: -93300, color: "#a49474"},
    {id: "floacite", hardness: 6, commonness: 5, maxY: 3050, minY: 250, color: "#fba7ff"},
    {id: "trimium", hardness: 6, commonness: 12, maxY: -10315120, minY: -10315200, color: "#762827"},
    {id: "quartz", hardness: 7, commonness: 25, maxY: 0, minY: -Infinity, color: "#ffcccc"},
    {id: "chalcedony", hardness: 7, commonness: 10, maxY: -1000, minY: -Infinity, color: "#ffffcc"},
    {id: "amethyst", hardness: 7, commonness: 3, maxY: 0, minY: 100, color: "#c878ff"},
    {
        id: "arsenopyrite",
        hardness: 7,
        commonness: 15,
        maxY: -12000,
        minY: -12036,
        deadliness: 25,
        color: "#ffe462"
    },
    {id: "garnet", hardness: 7, commonness: 4, maxY: -13000, minY: -19291, color: "#ff2626d0"},
    {id: "topaz", hardness: 8, commonness: 4, maxY: -20000, minY: -813213, color: "#ff9900b0"},
    {id: "sapphire", hardness: 8, commonness: 3, maxY: -24000, minY: -3000000, color: "#4f4fffb0"},
    {id: "ruby", hardness: 9, commonness: 1, maxY: -38000, minY: -6000000, color: "#ff0040b0"},
    {id: "diamond", hardness: 10, commonness: 0.21, maxY: -90000, minY: -Infinity, color: "#7cdcffb0"},
    {id: "unobtainium", hardness: 10, commonness: 0.001, maxY: -666, minY: -666, color: "#ff00ff"},

    {id: "wood", hardness: 1, color: "#573218"},
    {id: "stoneBlock", hardness: 2, color: "#646464"},
    {id: "graniteBlock", hardness: 2, color: "#a27878"},
    {id: "andesiteBlock", hardness: 2, color: "#c0c0c0"},
    {id: "dioriteBlock", hardness: 2, color: "#e8e8e8"},
    {id: "pumiceBlock", hardness: 2, color: "#d5d059"},
    {id: "airBlock", hardness: 0, color: "#ffffff60"},

    {id: "furnace", hardness: 1, color: "#5d3c2b"},
    // Viscosity = milliseconds to move to a new block
    {
        id: "water",
        types: ["liquid"],
        viscosity: 200,
        commonness: 60,
        maxY: 1,
        minY: -1000000,
        color: "#005ac0",
        onInteract: () => {
            player.drinkPoints += 100;
        }
    },
    {id: "oil", types: ["liquid"], viscosity: 300, commonness: 30, maxY: -50, minY: -300, color: "#31302c"},
    {
        id: "lava",
        types: ["liquid"],
        viscosity: 1500,
        commonness: 10,
        maxY: -6000,
        minY: -1000000,
        deadliness: 15,
        color: "#ff4d00"
    },
    {
        id: "mercury",
        types: ["liquid"],
        viscosity: 150,
        commonness: 25,
        maxY: -10,
        minY: -30,
        deadliness: 5,
        color: "#d9d5bc"
    }
];

for (let i = 0; i < ores.length; i++) {
    if (ores[i].hardness === undefined || ores[i].hardness === null) {
        ores[i].hardness = 0;
    }
    if (ores[i].types === undefined) {
        ores[i].types = [];
    }
}

let items = {

    // Resources
    space: {name: "Space", size: 0, desc: "You went so far up you went into outer space. Nice job!"},
    air: {name: "Air", size: 0, desc: "Air is the thing you breathe, and it is found everywhere."},
    dirt: {
        name: "Dirt",
        size: 1,
        desc: "Dirt is a very common material. You can sift through this for some other materials.",
        extraFunctions: [{
            name: "Sift", function() {
                addItem("dirt", -1);
                for (let i = 0; i < 5; i++) {
                    const loot = generateLoot([
                        {id: "stone", weight: 100, count: {min: 0, max: 1, round: 0.1}},
                        {id: "limonite", weight: 10, count: {min: 0, max: 1, round: 0.1}},
                        {id: "copper", weight: 5, count: {min: 0, max: 1, round: 0.1}},
                        {id: "geode", weight: 4, count: {min: 1, max: 1, round: 1}},
                        {id: "silver", weight: 3, count: {min: 0, max: 1, round: 0.1}},
                        {id: "gold", weight: 1, count: {min: 0, max: 1, round: 0.1}},
                        {id: "diamond", weight: 0.1, count: {min: 0, max: 1, round: 0.1}},
                        {id: "trimium", weight: 0.01, count: {min: 0, max: 1, round: 0.1}},
                        {id: "unobtainium", weight: 0.001, count: {min: 0, max: 0.1, round: 0.01}}
                    ]);
                    addItem(loot[0], loot[1]);
                }
            }
        }]
    },
    log: {
        name: "Log",
        size: 1,
        desc: "Logs can be crafted into wood, which is a base material for many items.",
        rarity: "Common"
    },
    leaves: {
        name: "Leaves",
        size: 0.05,
        desc: "The plural form of 'leaf'",
        rarity: "Common"
    },
    stick: {
        name: "Stick",
        size: 0.25,
        desc: "Sticks are an essential because they can be crafted into tools.",
        rarity: "Common"
    },
    stone: {
        name: "Stone",
        size: 2,
        desc: "Stone is a very common block; it is likely the most common one, and it can be crafted into blocks for building."
    },
    granite: {
        name: "Granite",
        size: 2,
        desc: "Granite is another stone type and can be crafted into blocks. It also has some storage uses."
    },
    andesite: {name: "Andesite", size: 2, desc: "Andesite is another stone type and can be crafted into blocks."},
    diorite: {name: "Diorite", size: 2, desc: "Diorite is another stone type and can be crafted into blocks."},
    pumice: {name: "Pumice", size: 0.75, desc: "Pumice is a light stone that can be crafted into blocks."},
    talc: {
        name: "Talc",
        size: 2,
        desc: "Talc is a very soft material (in rock terms), can be used to craft rocket boots, and has some storage uses."
    },
    coal: {name: "Coal", size: 1.5, desc: "Coal is needed to smelt all ores into bars."},
    limonite: {name: "Limonite", size: 3, desc: "Limonite is an iron ore and can be smelted into iron bars."},
    copper: {name: "Copper Ore", size: 3, desc: "Copper ore can be smelted into copper bars."},
    chromite: {name: "Chromite", size: 3, desc: "Chromite is a chromium ore and can be smelted into chrome bars."},
    petrifiedWood: {
        name: "Petrified Wood",
        size: 3,
        desc: "Petrified wood is found underground and can be crafted into regular wood."
    },
    cassiterite: {name: "Cassiterite", size: 2.5, desc: "Cassiterite is a tin ore and can be smelted into tin bars."},
    silver: {name: "Silver Ore", size: 3, desc: "Silver ore can be smelted into silver bars."},
    titanite: {name: "Titanite", size: 2, desc: "Titanite is a titanium ore and can be smelted into titanium bars."},
    gold: {name: "Gold Ore", size: 4, desc: "Gold is a soft material and can be smelted into gold bars."},
    hematite: {name: "Hematite", size: 4, desc: "Hematite is an iron ore and can be smelted into heavy iron bars."},
    apatite: {name: "Apatite", size: 1, desc: "Apatite is a somewhat hard gem and has some storage uses."},
    barite: {
        name: "Barite (Barium Ore)",
        size: 1.1,
        desc: "Barite is a barium ore and can be smelted into barium bars."
    },
    floacite: {
        name: "Floacite (Flotu Ore)",
        size: 0.3,
        desc: "Floacite is a flotu ore and can be smelted into flotu bars, which is a very light material."
    },
    trimium: {
        name: "Trimium",
        size: 1.75,
        desc: "Trimium is a material that only generates extremely deep in the earth. It is needed to craft the best items in the game."
    },
    arsenopyrite: {name: "Arsenopyrite", size: 2, desc: "Arsenopyrite is a poisonous block and serves no purpose."},
    garnet: {name: "Garnet", size: 1, desc: "Garnet is a pretty average gem."},
    topaz: {name: "Topaz", size: 1.2, desc: "Topaz is a somewhat common gem."},
    sapphire: {
        name: "Sapphire",
        size: 1,
        desc: "Sapphires are a type of corundum and are needed to craft corundum tools."
    },
    ruby: {name: "Ruby", size: 1.1, desc: "Rubies are a type of corundum and are needed to craft corundum tools."},
    diamond: {
        name: "Diamond",
        size: 1,
        desc: "Diamonds are a rare gem that generates deep in the earth. They can be crafted into many things."
    },
    unobtainium: {
        name: "Unobtainium",
        size: 10,
        desc: "Unobtainium is an extremely rare material that only generates at an altitude of -666. It is needed to craft endgame items."
    },
    geode: {
        name: "Geode",
        size: 1.5,
        desc: "Smash this open to reveal some resources.",
        extraFunctions: [{
            name: "Smash", function() {
                addItem("geode", -1);
                addItem("chalcedony", Math.floor(Math.random() * 10) / 10);
                const loot = generateLoot([
                    {id: "quartz", weight: 10, count: {min: 0, max: 4, round: 0.1}},
                    {id: "amethyst", weight: 3, count: {min: 0, max: 4, round: 0.1}},
                    {id: "garnet", weight: 2.5, count: {min: 0, max: 4, round: 0.1}},
                    {id: "topaz", weight: 2, count: {min: 0, max: 4, round: 0.1}},
                    {id: "apatite", weight: 1.5, count: {min: 0, max: 4, round: 0.1}},
                    {id: "sapphire", weight: 1, count: {min: 0, max: 4, round: 0.1}},
                    {id: "ruby", weight: 0.5, count: {min: 0, max: 4, round: 0.1}},
                    {id: "floacite", weight: 0.8, count: {min: 0, max: 4, round: 0.1}},
                    {id: "diamond", weight: 0.1, count: {min: 0, max: 4, round: 0.1}}
                ]);
                addItem(loot[0], loot[1]);
            }
        }]
    },

    // Blocks

    wood: {
        name: "Wood",
        size: 1,
        types: ["block"],
        desc: "Wood is an essential material in many crafting recipes and can be used for building."
    },
    stoneBlock: {name: "Stone Block", types: ["block"], desc: "Stone blocks can be used for building."},
    graniteBlock: {name: "Granite Block", types: ["block"], desc: "Granite blocks can be used for building."},
    andesiteBlock: {name: "Andesite Block", types: ["block"], desc: "Andesite blocks can be used for building."},
    dioriteBlock: {name: "Diorite Block", types: ["block"], desc: "Diorite blocks can be used for building."},
    pumiceBlock: {name: "Pumice Block", types: ["block"], desc: "Pumice blocks can be used for building."},
    airBlock: {
        name: "Air Block",
        size: 0.001,
        types: ["block", "cantDrop"],
        desc: "Air blocks are your starter blocks. There is no way to obtain them other than starting over or dying. They also weigh next to nothing."
    },
    furnace: {
        name: "Furnace",
        desc: "A furnace is used to smelt ores into bars."
    },

    // Other Crafted Items

    ironBar: {
        name: "Iron Bar",
        size: 6,
        desc: "Iron bars can be crafted into many things, such as tools and storage devices."
    },
    copperBar: {
        name: "Copper Bar",
        size: 6,
        desc: "Copper bars can be used to make early-game tools."
    },
    bronzeBar: {
        name: "Bronze Bar",
        size: 7,
        desc: "Bronze can be used to craft decent tools."
    },
    tinBar: {
        name: "Tin Bar",
        size: 5,
        desc: "Tin can be crafted into tools or the ore can be mixed with copper to make bronze."
    },
    chromeBar: {
        name: "Chrome Bar",
        size: 6,
        desc: "Everything is chrome in the future!"
    },
    silverBar: {
        name: "Silver Bar",
        size: 6,
        desc: "Silver can be made into tools."
    },
    titaniumBar: {
        name: "Titanium Bar",
        size: 4,
        desc: "Titanium is a hard metal that can be made into tools."
    },
    goldBar: {
        name: "Gold Bar",
        size: 8,
        desc: "Gold has some uses with storage and endgame items."
    },
    heavyIronBar: {
        name: "Heavy Iron Bar",
        size: 8,
        desc: "It's iron, but denser."
    },
    bariumBar: {
        name: "Barium Bar",
        size: 2.2,
        desc: "Barium is a metal."
    },
    flotuBar: {
        name: "Flotu Bar",
        size: 0.6,
        desc: "Flotu is a metal that is almost lighter than air. Can be used to make endgame items."
    },
    unobtainableBar: {
        name: "Unobtainable Bar",
        desc: "One of the rarest items in the game. Used to craft the Infinity Box."
    },
    water: {
        name: "Water Bucket", size: 1, desc: "The most common liquid. You can drink it.", extraFunctions: [{
            name: "Drink", function: () => {
                addItem("water", -1);
                addItem("bucket", 1);
                player.drinkPoints += 100;
            }
        }]
    },
    oil: {name: "Oil Bucket", size: 1, desc: "This common liquid can be used as fuel.", rarity: "Common"},
    lava: {
        name: "Lava Bucket",
        size: 2,
        desc: "This liquid found very deep below the surface is hot and can kill you.",
        extraFunctions: [{
            name: "Drink", function: () => {
                die("Why on earth did you think it would be a good idea to drink lava?");
            }
        }]
    },
    mercury: {name: "Mercury Bucket", size: 5, desc: "Mercury is a poisonous liquid metal."},

    bucket: {
        name: "Bucket",
        desc: "Buckets are an essential, as they are needed to pick up liquids.",
        types: ["bucket"]
    },

    // Tools

    stickAxe: {
        name: "Long Stick",
        types: ["axe"],
        durability: 8,
        recycle: [{id: "stick", count: 2}]
    },
    woodAxe: {
        name: "Wood Axe",
        types: ["axe"],
        durability: 15,
        recycle: [{id: "stick", count: 3}, {id: "wood", count: 6}]
    },
    stoneAxe: {
        name: "Stone Axe",
        types: ["axe"],
        durability: 40,
        recycle: [{id: "stone", count: 6}, {id: "stick", count: 3}]
    },
    talcAxe: {
        name: "Talc Axe",
        types: ["axe"],
        durability: 40,
        recycle: [{id: "talc", count: 6}, {id: "stick", count: 3}]
    },
    ironAxe: {
        name: "Iron Axe",
        types: ["axe"],
        durability: 100,
        recycle: [{id: "ironBar", count: 4}, {id: "stick", count: 4}]
    },
    copperAxe: {
        name: "Copper Axe",
        types: ["axe"],
        durability: 80,
        recycle: [{id: "copperBar", count: 4}, {id: "stick", count: 4}]
    },
    bronzeAxe: {
        name: "Bronze Axe",
        types: ["axe"],
        durability: 240,
        recycle: [{id: "bronzeBar", count: 6}, {id: "stick", count: 3}]
    },
    tinAxe: {
        name: "Tin Axe",
        types: ["axe"],
        durability: 90,
        recycle: [{id: "tinBar", count: 4}, {id: "stick", count: 4}]
    },
    silverAxe: {
        name: "Silver Axe",
        types: ["axe"],
        durability: 200,
        recycle: [{id: "silverBar", count: 4}, {id: "stick", count: 4}]
    },
    titaniumAxe: {
        name: "Titanium Axe",
        types: ["axe"],
        durability: 300,
        recycle: [{id: "titaniumBar", count: 5}, {id: "stick", count: 6}]
    },
    goldAxe: {
        name: "Gold Axe",
        types: ["axe"],
        durability: 60,
        recycle: [{id: "goldBar", count: 4}, {id: "stick", count: 5}]
    },
    apatiteAxe: {
        name: "Apatite Axe",
        types: ["axe"],
        durability: 500,
        recycle: [{id: "apatite", count: 4}, {id: "stick", count: 3}]
    },
    bariumAxe: {
        name: "Barium Axe",
        types: ["axe"],
        durability: 1000,
        recycle: [{id: "bariumBar", count: 8}, {id: "stick", count: 5}]
    },
    garnetAxe: {
        name: "Garnet Axe",
        types: ["axe"],
        durability: 4250,
        recycle: [{id: "garnet", count: 12}, {id: "stick", count: 18}]
    },
    topazAxe: {
        name: "Topaz Axe",
        types: ["axe"],
        durability: 6010,
        recycle: [{id: "topaz", count: 18}, {id: "stick", count: 22}]
    },
    corundumAxe: {
        name: "Corundum Axe",
        types: ["axe"],
        durability: 7880,
        recycle: [{id: "sapphire", count: 12}, {id: "ruby", count: 12}, {id: "stick", count: 10}]
    },
    diamondAxe: {
        name: "Diamond Axe",
        types: ["axe"],
        durability: 10000,
        recycle: [{id: "diamond", count: 10}, {id: "topaz", count: 1}, {id: "stick", count: 12}]
    },

    stickPickaxe: {
        name: "Long Sharp Stick",
        strength: 1,
        types: ["pickaxe"],
        durability: 8,
        recycle: [{id: "stick", count: 2}]
    },
    woodPickaxe: {
        name: "Wood Pickaxe",
        durability: 15,
        types: ["pickaxe"],
        strength: 2,
        recycle: [{id: "stick", count: 3}, {id: "wood", count: 6}]
    },
    stonePickaxe: {
        name: "Stone Pickaxe",
        durability: 40,
        types: ["pickaxe"],
        strength: 3,
        recycle: [{id: "stone", count: 6}, {id: "stick", count: 3}]
    },
    talcPickaxe: {
        name: "Talc Pickaxe",
        durability: 40,
        types: ["pickaxe"],
        strength: 4,
        recycle: [{id: "talc", count: 6}, {id: "stick", count: 3}]
    },
    ironPickaxe: {
        name: "Iron Pickaxe",
        durability: 100,
        types: ["pickaxe"],
        strength: 5,
        recycle: [{id: "ironBar", count: 4}, {id: "stick", count: 4}]
    },
    copperPickaxe: {
        name: "Copper Pickaxe",
        durability: 80,
        types: ["pickaxe"],
        strength: 6,
        recycle: [{id: "copperBar", count: 4}, {id: "stick", count: 4}]
    },
    bronzePickaxe: {
        name: "Bronze Pickaxe",
        durability: 240,
        types: ["pickaxe"],
        strength: 7,
        recycle: [{id: "bronzeBar", count: 6}, {id: "stick", count: 3}]
    },
    tinPickaxe: {
        name: "Tin Pickaxe",
        durability: 90,
        types: ["pickaxe"],
        strength: 5,
        recycle: [{id: "tinBar", count: 4}, {id: "stick", count: 4}]
    },
    silverPickaxe: {
        name: "Silver Pickaxe",
        durability: 200,
        types: ["pickaxe"],
        strength: 6,
        recycle: [{id: "silverBar", count: 4}, {id: "stick", count: 4}]
    },
    titaniumPickaxe: {
        name: "Titanium Pickaxe",
        durability: 300,
        types: ["pickaxe"],
        strength: 7,
        recycle: [{id: "titaniumBar", count: 5}, {id: "stick", count: 6}]
    },
    goldPickaxe: {
        name: "Gold Pickaxe",
        durability: 60,
        types: ["pickaxe"],
        strength: 4,
        recycle: [{id: "goldBar", count: 4}, {id: "stick", count: 5}]
    },
    apatitePickaxe: {
        name: "Apatite Pickaxe",
        durability: 500,
        types: ["pickaxe"],
        strength: 7,
        recycle: [{id: "apatite", count: 4}, {id: "stick", count: 3}]
    },
    bariumPickaxe: {
        name: "Barium Pickaxe",
        durability: 1000,
        types: ["pickaxe"],
        strength: 8,
        recycle: [{id: "bariumBar", count: 8}, {id: "stick", count: 5}]
    },
    garnetPickaxe: {
        name: "Garnet Pickaxe",
        durability: 4250,
        types: ["pickaxe"],
        strength: 9,
        recycle: [{id: "garnet", count: 12}, {id: "stick", count: 18}]
    },
    topazPickaxe: {
        name: "Topaz Pickaxe",
        durability: 6010,
        types: ["pickaxe"],
        strength: 9,
        recycle: [{id: "topaz", count: 18}, {id: "stick", count: 22}]
    },
    corundumPickaxe: {
        name: "Corundum Pickaxe",
        durability: 7880,
        types: ["pickaxe"],
        strength: 10,
        recycle: [{id: "sapphire", count: 12}, {id: "ruby", count: 12}, {id: "stick", count: 10}]
    },
    diamondPickaxe: {
        name: "Diamond Pickaxe",
        durability: 10000,
        types: ["pickaxe"],
        strength: 10,
        recycle: [{id: "diamond", count: 10}, {id: "topaz", count: 1}, {id: "stick", count: 12}]
    },
    shoppingBag: {
        name: "Shopping Bag", desc: "The cheapest storage system. Gives +25 lbs of storage."
    },
    box: {
        name: "Box",
        desc: "Easy to obtain storage system, but somewhat effective. Gives +100 lbs of storage."
    },
    backpack: {
        name: "Backpack",
        desc: "The backpack gives +500 lbs of storage."
    },
    magicBucket: {
        name: "Magic Bucket",
        desc: "The magic bucket gives +2k lbs of storage."
    },
    vault: {
        name: "Vault", desc: "The vault gives +25k lbs of storage."
    },
    chest: {
        name: "Chest", desc: "The chest gives +150k lbs of storage."
    },
    veryExpensiveEnormousBox: {
        name: "Very Expensive Enormous Box",
        desc: "This box gives +10M lbs of storage."
    },
    infinityBox: {
        name: "Infinity Box",
        desc: "Gives your inventory infinite storage."
    },
    rocketBoots: {
        name: "Rocket Boots", desc: "Gives you the ability to fly."
    },
    fuel: {
        name: "Fuel", desc: "Basic furnace fuel. Needed to smelt ores."
    },

    apple: {
        name: "Apple",
        size: 0.2,
        types: ["food"],
        foodValue: 10,
        drinkValue: 5,
        desc: "Apples are currently the only food item in the game. You can eat them to restore some food and drink points.",
        rarity: "Common"
    },
    steak: {
        name: "Steak",
        size: 1,
        types: ["food"],
        foodValue: 30,
        needsToBeCooked: true,
        desc: "Steaks are a food that needs to be cooked to be able to nourish you. However, once cooked, they fill a lot of food points."
    },
    coldProtection: {name: "Cold Protection", size: 20, desc: "Protects you from the cold."},
    heatProtection: {name: "Heat Protection", size: 20, desc: "Protects you from the heat."}
};