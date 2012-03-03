// Assassin attack

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],
	lastTrapPos: {},

	init: function () {
		var i;

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 3;
				break;
			case 251: // Fire Blast
			case 256: // Shock Web
			case 257: // Blade Sentinel
			case 266: // Blade Fury
				this.skillRange[i] = 15;
				break;
			case 255: // Dragon Talon
			case 260: // Dragon Claw
			case 270: // Dragon Tail
				this.skillRange[i] = 3;
				this.skillHand[i] = 2; // shift bypass
				break;
			case 273: // Mind Blast
			case 253: // Psychic Hammer
			case 275: // Dragon Flight
				this.skillRange[i] = 20;
				break;
			// oskills
			case 151: // Whirlwind
				this.skillRange[i] = 10;
				break;
			default: // Every other skill
				this.skillRange[i] = 20;
				break;
			}
		}
	},

	doAttack: function (unit) {
		// TODO: preattack, merc stomp, better resist check
		if (Town.needMerc()) {
			Town.visitTown();
		}

		var index, checkTraps,
			resist = 117;

		index = (unit.spectype & 0x7) ? 1 : 3;
		checkTraps = this.checkTraps(unit);

		if (checkTraps) {
			if (Math.round(getDistance(me, unit)) > 20 || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, 20, 0x4);
			}

			this.placeTraps(unit, checkTraps);
		}

		// Cloak of Shadows - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (Config.UseCloakofShadows && me.getSkill(264, 1) && getDistance(me, unit) < 20 && !me.getState(121) && !me.getState(153)) {
			Skill.cast(264, 0);
		}

		if (Attack.getResist(unit, this.skillElement[index]) < resist) {
			if (!this.doCast(unit, index)) {
				return 2;
			}

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.getResist(unit, this.skillElement[5]) < resist) {
			if (!this.doCast(unit, 5)) {
				return 2;
			}

			return 3;
		}

		return 1;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	doCast: function (unit, index) {
		var i;

		if (unit.mode === 0 || unit.mode === 12) {
			return true;
		}

		if (Config.AttackSkill[index] === 151) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x1)) {
				Attack.getIntoPosition(unit, this.skillRange[index], 0x1);
			}

			return this.whirlwind(unit, index);
		}

		if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[index])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[index], 0x4);
			}

			return Skill.cast(Config.AttackSkill[index], this.skillHand[index], unit);
		}

		if (Config.AttackSkill[index + 1] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[index + 1] || checkCollision(me, unit, 0x4)) {
				Attack.getIntoPosition(unit, this.skillRange[index + 1], 0x4);
			}

			return Skill.cast(Config.AttackSkill[index + 1], this.skillHand[index + 1], unit);
		}

		for (i = 0; i < 25; i += 1) {
			delay(40);

			if (!me.getState(121)) {
				break;
			}
		}

		return false;
	},

	checkTraps: function (unit) {
		if (!Config.UseTraps) {
			return false;
		}

		// getDistance crashes when using an object with x, y props, that's why it's unit.x, unit.y and not unit
		if (me.getMinionCount(17) === 0 || !this.lastTrapPos.hasOwnProperty("x") || getDistance(unit.x, unit.y, this.lastTrapPos.x, this.lastTrapPos.y) > 15) {
			return 5;
		}

		return 5 - me.getMinionCount(17);
	},

	placeTraps: function (unit, amount) {
		var i, j, 
			traps = 0;

		for (i = -1; i <= 1; i += 1) {
			for (j = -1; j <= 1; j += 1) {
				if (Math.abs(i) !== Math.abs(j)) { // used for X formation
					continue;
				}

				// unit can be an object with x, y props too, that's why having "mode" prop is checked
				if (traps >= amount || unit.hasOwnProperty("mode") && (unit.mode === 0 || unit.mode === 12)) {
					return true;
				}

				if (unit.hasOwnProperty("spectype") && (unit.spectype & 0x5)) {
					if (traps >= Config.BossTraps.length) {
						return true;
					}

					Skill.cast(Config.BossTraps[traps], 0, unit.x + i, unit.y + j);
				} else {
					if (traps >= Config.BossTraps.length) {
						return true;
					}

					Skill.cast(Config.Traps[traps], 0, unit.x + i, unit.y + j);
				}

				this.lastTrapPos = {x: unit.x, y: unit.y};

				traps += 1;
			}
		}

		return true;
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
	}
};