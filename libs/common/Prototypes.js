// TODO: Determine whether to keep this file or move the prototypes to their appropriate sections

// Check if unit is idle
Unit.prototype.__defineGetter__("idle",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.idle: Must be used with player units.");
		}

		return (me.mode === 1 || me.mode === 5);
	}
	);

// Check if unit is in town
Unit.prototype.__defineGetter__("inTown",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.inTown: Must be used with player units.");
		}

		return [1, 40, 75, 103, 109].indexOf(this.area) > -1;
	}
	);

Unit.prototype.__defineGetter__("attacking",
	function () {
		if (this.type > 0) {
			throw new Error("Unit.attacking: Must be used with player units.");
		}

		return [7, 8, 10, 11, 12, 13, 14, 15, 16, 18].indexOf(me.mode) > -1;
	}
	);

// Open NPC menu
Unit.prototype.openMenu = function () {
	if (this.type !== 1) {
		throw new Error("Unit.openMenu: Must be used on NPCs.");
	}

	if (getUIFlag(0x08)) {
		return true;
	}

	var i, j;

	for (i = 0; i < 3; i += 1) {
		if (getDistance(me, this) > 3) {
			Pather.moveToUnit(this);
		}

		this.interact();

		for (j = 0; j < 100; j += 1) {
			if (j % 20 === 0) {
				me.cancel();
				delay(300);
				this.interact();
			}

			if (getUIFlag(0x08)) {
				delay(250 + me.ping);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

// mode = "Gamble", "Repair" or "Trade"
Unit.prototype.startTrade = function (mode) {
	if (this.type !== 1) {
		throw new Error("Unit.startTrade: Must be used on NPCs.");
	}

	if (getUIFlag(0x0C)) {
		return true;
	}

	var i, tick,
		menuId = mode === "Gamble" ? 0x0D46 : mode === "Repair" ? 0x0D06 : 0x0D44;

	for (i = 0; i < 3; i += 1) {
		if (!this.openMenu()) {
			continue;
		}

		this.useMenu(menuId);

		tick = getTickCount();

		while (getTickCount() - tick < 1000) {
			if (getUIFlag(0x0C) && this.itemcount > 0) {
				delay(400);

				return true;
			}

			delay(10);
		}

		me.cancel();
	}

	return false;
};

Unit.prototype.buy = function (shiftBuy) {
	if (this.type !== 4) { // Check if it's an item we want to buy
		throw new Error("Unit.buy: Must be used on items.");
	}

	if (!getUIFlag(0xC) || this.getParent().gid !== getInteractedNPC().gid) { // Check if it's an item belonging to a NPC
		throw new Error("Unit.buy: Must be used in shops.");
	}

	if (me.getStat(14) + me.getStat(15) < this.getItemCost(0)) { // Can we afford the item?
		return false;
	}

	var i, tick,
		gold = me.getStat(14) + me.getStat(15);

	for (i = 0; i < 3; i += 1) {
		this.shop(shiftBuy ? 6 : 2);

		tick = getTickCount();

		while (getTickCount() - tick < 2000) {
			if (me.getStat(14) + me.getStat(15) !== gold) {
				delay(500);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

Unit.prototype.sell = function () {
	if (this.type !== 4) { // Check if it's an item we want to buy
		throw new Error("Unit.sell: Must be used on items.");
	}

	if (!getUIFlag(0xC)) { // Check if it's an item belonging to a NPC
		throw new Error("Unit.sell: Must be used in shops.");
	}

	var i, tick,
		itemCount = me.itemcount;

	for (i = 0; i < 100; i += 1) {
		this.shop(1);

		tick = getTickCount();

		while (getTickCount() - tick < 2000) {
			if (me.itemcount !== itemCount) {
				delay(500);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

Unit.prototype.toCursor = function () {
	if (this.type !== 4) {
		throw new Error("Unit.toCursor: Must be used with items.");
	}

	var i, tick;

	for (i = 0; i < 3; i += 1) {
		if (this.mode === 1) {
			clickItem(0, this.bodylocation); // fix for equipped items (cubing viper staff fro example)
		} else {
			clickItem(0, this);
		}

		tick = getTickCount();

		while (getTickCount() - tick < 1000) {
			if (me.itemoncursor) {
				delay(200);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

Unit.prototype.drop = function () {
	if (this.type !== 4) {
		throw new Error("Unit.drop: Must be used with items.");
	}

	var i, tick;

	if (!this.toCursor()) {
		return false;
	}

	for (i = 0; i < 3; i += 1) {
		clickMap(0, 0, me.x, me.y);
		delay(40);
		clickMap(2, 0, me.x, me.y);

		tick = getTickCount();

		while (getTickCount() - tick < 500) {
			if (!me.itemoncursor) {
				delay(200);

				return true;
			}

			delay(10);
		}
	}

	return false;
};

me.findItem = function (id, mode, loc) {
	if (this.type > 1) {
		throw new Error("Unit.findItem: Must be used on PCs or NPCs.");
	}

	switch (arguments.length) {
	case 0:
		id = -1;
	case 1:
		mode = -1;
	case 2:
		loc = false;
		break;
	}

	var item = this.getItem(id, mode);

	if (!item) {
		return false;
	}

	if (loc) {
		while (item.location !== loc) {
			if (!item.getNext()) {
				break;
			}
		}

		if (item.location !== loc) {
			return false;
		}
	}

	return item;
};

me.findItems = function (id, mode, loc) {
	switch (arguments.length) {
	case 0:
		id = -1;
	case 1:
		mode = -1;
	case 2:
		loc = false;
		break;
	}

	var list = [],
		item = me.getItem(id, mode);

	if (!item) {
		return false;
	}

	do {
		if (loc) {
			if (item.location === loc) {
				list.push(copyUnit(item));
			}
		} else {
			list.push(copyUnit(item));
		}
	} while (item.getNext());

	if (!list.length) {
		return false;
	}

	return list;
};

Unit.prototype.getPrefix = function (id) {
	if (this.hasOwnProperty("prefixnum")) {
		return this.prefixnum === id;
	}
	
	switch (id) {
	case this.prefixnum1:
	case this.prefixnum2:
	case this.prefixnum3:
		return true;
	}

	return false;
};

Unit.prototype.getSuffix = function (id) {
	if (this.hasOwnProperty("suffixnum")) {
		return this.suffixnum === id;
	}

	switch (id) {
	case this.suffixnum1:
	case this.suffixnum2:
	case this.suffixnum3:
		return true;
	}

	return false;
};