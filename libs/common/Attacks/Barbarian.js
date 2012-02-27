// Barbarian attack

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],

	init: function () {
		var i;

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 2;
				break;
			case 126: // Bash
			case 133: // Double Swing
			case 139: // Stun
			case 144: // Concentrate
			case 147: // Frenzy
			case 152: // Berserk
			case 232: // Feral Rage
				this.skillRange[i] = 2;
				this.skillHand[i] = 2; // shift bypass
				break;
			case 130: // Howl
				this.skillRange[i] = 10;
				break;
			case 146: // Battle Cry
			case 154: // War Cry
				this.skillRange[i] = 5;
				break;
			case 151: // Whirlwind
				this.skillRange[i] = 10;
				break;
			case 132: // Leap
				this.skillRange[i] = 10; // TODO: Calculation
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}
	},

	doAttack: function (unit) {
		var index;

		index = (unit.spectype & 0x7) ? 1 : 3;

		if (Attack.getResist(unit, this.skillElement[index]) < 100) {
			if (Config.Werewolf && !me.getState(139)) {
				Misc.shapeShift(0);
			}

			if (!this.doCast(unit, index)) {
				return 2;
			}

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.getResist(unit, this.skillElement[5]) < 100) {
			if (!this.doCast(unit, 5)) {
				return 2;
			}

			return 3;
		}

		print(unit.name + " immune to attacks.");
		return 1;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
		this.findItem(me.area === 83 ? 60 : 20);

		if (me.getState(139)) {
			Misc.unShift();
		}
	},

	doCast: function (unit, index) {
		var i;

		if (Config.AttackSkill[index] === 151) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x1)) {
				Attack.getIntoPosition(unit, this.skillRange[index], 0x1);
			}

			if (!this.whirlwind(unit, index)) {
				if (Config.AttackSkill[6] > 0) {
					index = 6;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}

		if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
			// walk short distances instead of tele for melee attacks
			Attack.getIntoPosition(unit, this.skillRange[index], 0x4, me.getState(139) || this.skillRange[index] < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1));
		}

		return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit);
	},

	whirlwind: function (unit, index) {
		if (me.mp < 30) {
			return false;
		}

		var i, j, coords, angle,
			//angles = [180, 45, -45, 90, -90]; // Angle offsets
			angles = [120, -120, 180, 45, -45, 90, -90]; // Angle offsets

		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);

MainLoop: for (i = 0; i < angles.length; i += 1) { // get a better spot
			for (j = 0; j < 5; j += 1) {
				coords = [Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * j + unit.x), Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * j + unit.y)];

				if (CollMap.getColl(coords[0], coords[1]) & 0x1) {
					continue MainLoop;
				}
			}

			if (getDistance(me, coords[0], coords[1]) >= 3) {
				//me.runwalk = 0;

				return Skill.cast(Config.AttackSkill[index], this.skillHand[index], coords[0], coords[1]);
			}
		}

		return false;
	},

	checkCloseMonsters: function (range) {
		var monster;

		monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster) && getDistance(me, monster) <= range && !checkCollision(me, monster, 0x4)) {
					return true;
				}
			} while (monster.getNext());
		}

		return false;
	},

	findItem: function (range) {
		if (!Config.FindItem || !me.getSkill(142, 1)) {
			return false;
		}

		var i, j, tick, corpse, orgX, orgY,
			corpseList = [];

		orgX = me.x;
		orgY = me.y;

MainLoop: for (i = 0; i < 3; i += 1) {
			corpse = getUnit(1, -1, 12);

			if (corpse) {
				do {
					if (getDistance(corpse, orgX, orgY) <= range && this.checkCorpse(corpse)) {
						corpseList.push(copyUnit(corpse));
					}
				} while (corpse.getNext());
			}

			while (corpseList.length > 0) {
				if (this.checkCloseMonsters(15)) {
					Precast.weaponSwitch(Math.abs(Config.FindItemSwitch - 1));
					Attack.clear(15);

					i = -1;

					continue MainLoop;
				}

				corpseList.sort(Sort.units);

				corpse = corpseList.shift();

				if (!this.checkCorpse(corpse)) {
					continue;
				}

				if (getDistance(me, corpse) > 9 || checkCollision(me, corpse, 0x1)) {
					Pather.moveToUnit(corpse);
				}

				Precast.weaponSwitch(Config.FindItemSwitch);

	CorpseLoop: for (j = 0; j < 3; j += 1) {
					Skill.cast(142, 0, corpse);

					tick = getTickCount();

					while (getTickCount() - tick < 1000) {
						if (corpse.getState(118)) {
							break CorpseLoop;
						}

						delay(10);
					}
				}
			}
		}

		Precast.weaponSwitch(Math.abs(Config.FindItemSwitch - 1));
		Pickit.pickItems();

		return true;
	},

	checkCorpse: function (unit) {
		if (unit.mode !== 12) {
			return false;
		}

		if ([345, 346, 347].indexOf(unit.classid) === -1 && unit.spectype === 0) {
			return false;
		}

		if (unit.classid <= 575 && !getBaseStat("monstats2", unit.classid, "corpseSel")) { // monstats2 doesn't contain guest monsters info. sigh..
			return false;
		}

		if (getDistance(me, unit) <= 25 &&
			!unit.getState(1) && // freeze
			!unit.getState(96) && // revive
			!unit.getState(99) && // redeemed
			!unit.getState(104) && // nodraw
			!unit.getState(107) && // shatter
			!unit.getState(118) // noselect
			) {
			return true;
		}

		return false;
	}
};