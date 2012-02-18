function main() {
	var i, mercHP, LifeMax, ManaMax, ironGolem,
		quitFlag = false,
		timerLastDrink = [];

	include("OOG.js");
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Prototypes.js");
	include("common/Runewords.js");
	print("�c3Start ToolsThread script");
	Config.init();

	for (i = 0; i < 5; i += 1) {
		timerLastDrink[i] = 0;
	}

	// Reset core chicken
	me.chickenhp = -1;
	me.chickenmp = -1;

	// General functions
	function GetPotion(pottype) {
		var i, length,
			items = me.getItems();

		if (!items) {
			return false;
		}

		for (i = 0, length = items.length; i < length; i = i + 1) {
			if (pottype === 78 && items[i].mode === 0 && items[i].location === 3 && items[i].itemType === 78) {
				print("�c2Drinking rejuventation potion from inventory.");
				return copyUnit(items[i]);
			}

			if (items[i].mode === 2 && items[i].itemType === pottype) {
				return copyUnit(items[i]);
			}
		}

		return false;
	}

	function TogglePause() {
		var script = getScript("default.dbj");

		if (script) {
			if (script.running) {
				print("�c1Pausing.");
				script.pause();
			} else {
				print("�c2Resuming.");
				script.resume();
			}
		}
	}

	function DrinkPotion(type) {
		var pottype, potion,
			tNow = getTickCount();

		switch (type) {
		case 0:
		case 1:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 1000) || me.getState(type === 0 ? 100 : 106)) {
				return false;
			}

			break;
		case 2:
		case 4:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 500)) { // small delay for juvs just to prevent using more at once
				return false;
			}

			break;
		default:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 8000)) {
				return false;
			}

			break;
		}

		if (me.mode === 0 || me.mode === 17 || me.mode === 18) { // mode 18 - can't drink while leaping/whirling etc.
			return false;
		}

		switch (type) {
		case 0:
		case 3:
			pottype = 76;
			break;
		case 1:
			pottype = 77;
			break;
		default:
			pottype = 78;
			break;
		}

		potion = GetPotion(pottype);

		if (potion) {
			if (me.mode === 0 || me.mode === 17) {
				return false;
			}

			if (type < 3) {
				potion.interact();
			} else {
				clickItem(2, potion);
			}

			timerLastDrink[type] = getTickCount();

			return true;
		}

		return false;
	}
	
	function GetNearestMonster() {
		var gid, distance,
			monster = getUnit(1),
			range = 30;

		if (monster) {
			do {
				if (monster.hp > 0 && !monster.getParent()) {
					distance = getDistance(me, monster);

					if (distance < range) {
						range = distance;
						gid = monster.gid;
					}
				}
			} while (monster.getNext());
		}

		monster = getUnit(1, -1, -1, gid);

		if (monster) {
			return ". Nearest monster: " + monster.name;
		}

		return ".";
	}
	
	function GetIronGolem() {
		var golem = getUnit(1, "iron golem");

		if (!golem) {
			return false;
		}

		do {
			if (golem.getParent().name === me.name) {
				return golem;
			}
		} while (golem.getNext());

		return false;
	}

	// Event functions
	function RevealArea(area) {
		var room = getRoom(area),
			roomsRevealed = [];

		do {
			if (room instanceof Room && room.area === area) {
				room.reveal(true);
			}
		} while (room.getNext());
	}

	function QuitWithLeader(mode, param1, param2, name1, name2) {
		if (mode === 0 || mode === 1 || mode === 3) {
			print(name1 + (mode === 0 ? " timed out" : " left"));

			if (Config.QuitList.indexOf(name1) > -1) {
				quitFlag = true;
			}
		}
	}

	addEventListener("gameevent", QuitWithLeader);
	addEventListener("keyup",
		function (key) {
			switch (key) {
			case 19: // Pause/Break key
				TogglePause();
				break;
			case 123: // F12 key
				me.overhead("Revealing " + getArea().name);
				RevealArea(me.area);
				break;
			}
		}
		);

	while (me.ingame) {
		if (!me.gameReady) {
			delay(200);

			continue;
		}
		
		if (Config.UseHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseHP / 100)) {
			DrinkPotion(0);
		}

		if (Config.UseRejuvHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseRejuvHP / 100)) {
			DrinkPotion(2);
		}

		if (Config.LifeChicken > 0 && !me.inTown && me.hp <= Math.floor(me.hpmax * Config.LifeChicken / 100)) {
			D2Bot.updateChickens();
			D2Bot.printToConsole("Life Chicken: " + me.hp + "/" + me.hpmax + " in " + getArea().name + GetNearestMonster() + ";1");

			me.chickenhp = me.hpmax; // Just to trigger the core chicken

			break;
		}

		if (Config.UseMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseMP / 100)) {
			DrinkPotion(1);
		}

		if (Config.UseRejuvMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseRejuvMP / 100)) {
			DrinkPotion(2);
		}

		if (Config.ManaChicken > 0 && !me.inTown && me.mp <= Math.floor(me.mpmax * Config.ManaChicken / 100)) {
			D2Bot.updateChickens();
			D2Bot.printToConsole("Mana Chicken: " + me.mp + "/" + me.mpmax + " in " + getArea().name + ";1");

			me.chickenmp = me.mpmax; // Just to trigger the core chicken

			break;
		}

		if (me.classid === 2) {
			if (!ironGolem || !copyUnit(ironGolem)) {
				ironGolem = GetIronGolem();
			}

			if (ironGolem && ironGolem.hp <= ironGolem.hpmax * 0.25) {
				D2Bot.updateChickens();
				D2Bot.printToConsole("Irom Golem Chicken in " + getArea().name + ";1");

				quit();

				break;
			}
		}

		if (Config.UseMerc && !me.inTown) {
			mercHP = getMercHP();

			if (mercHP > 0) {
				if (mercHP < Config.MercChicken) {
					quit();
					break;
				}

				if (mercHP < Config.UseMercRejuv) {
					DrinkPotion(4);
				} else if (mercHP < Config.UseMercHP) {
					DrinkPotion(3);
				}
			}
		}

		if (quitFlag) {
			quit();

			break;
		}

		delay(10);
	}
}