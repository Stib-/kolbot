// Only most popular ones for startersfunction Questing() {	var i,		quests = [			[1, "clearDen"],			[9, "killRadament"],			[17, "lamEssen"],			[25, "killIzual"],			[35, "killShenk"],			[37, "freeAnya"]		];	this.clearDen = function () {		var akara;		if (!Town.goToTown(1) || !Pather.moveToExit([2, 8], true)) {			throw new Error();		}		Precast.doPrecast(true);		Attack.clearLevel();		Town.goToTown();		Town.move("akara");		akara = getUnit(1, "akara");		akara.openMenu();		me.cancel();		return true;	};	this.killRadament= function () {		var book, atma;		if (!Town.goToTown() || !Pather.useWaypoint(48)) {			throw new Error();		}		Precast.doPrecast(true);		if (!Pather.moveToExit(49, true) || !Pather.moveToPreset(me.area, 2, 355)) {			throw new Error();		}		Attack.kill("radament");		book = getUnit(4, 552);		if (book) {			Pickit.pickItem(book);			delay(300);			clickItem(1, book);		}		Town.goToTown();		Town.move("atma");				atma = getUnit(1, "atma");				atma.openMenu();		me.cancel();		return true;	};		this.killIzual = function () {		var tyrael;		if (!Town.goToTown() || !Pather.useWaypoint(106)) {			throw new Error();		}		Precast.doPrecast(true);		if (!Pather.moveToPreset(105, 1, 256)) {			return false;		}		Attack.kill("izual");		Town.goToTown();		Town.move("tyrael");		tyrael = getUnit(1, "tyrael");		tyrael.openMenu();		me.cancel();		return true;	};	this.lamEssen = function () {		var stand, book, alkor;		if (!Town.goToTown() || !Pather.useWaypoint(80)) {			throw new Error();		}		Precast.doPrecast(true);		if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {			throw new Error();		}		stand = getUnit(2, 193);		Misc.openChest(stand);		delay(300);		book = getUnit(4, 548);		Pickit.pickItem(book);		Town.goToTown();		Town.move("alkor");		alkor = getUnit(1, "alkor");		alkor.openMenu();		me.cancel();		return true;	};	this.killShenk = function () {		if (!Town.goToTown() || !Pather.useWaypoint(111)) {			throw new Error();		}		Precast.doPrecast(true);		Pather.moveTo(3883, 5113);		Attack.kill("shenk the overseer");		Town.goToTown();		return true;	};	this.freeAnya = function () {		var anya, malah, scroll;		if (!Town.goToTown() || !Pather.useWaypoint(113)) {			throw new Error();		}		Precast.doPrecast(true);		if (!Pather.moveToExit(114, true) || !Pather.moveToPreset(me.area, 2, 460)) {			throw new Error();		}		delay(1000);		Attack.clear(10);		anya = getUnit(2, 558);		Pather.moveToUnit(anya);		anya.interact();		delay(300);		me.cancel();		Town.goToTown();		Town.move("malah");		malah = getUnit(1, "malah");		malah.openMenu();		me.cancel();		Town.move("portalspot");		Pather.usePortal(114, me.name);		anya.interact();		delay(300);		me.cancel();		Town.goToTown();		Town.move("malah");		malah.openMenu();		me.cancel();		scroll = me.getItem(646);		clickItem(1, scroll);		return true;	};	for (i = 0; i < quests.length; i += 1) {		if (!me.getQuest(quests[i][0], 0)) {			try {				this[quests[i][1]]();			} catch (e) {				print("Quest failed, moving to next one");				continue;			}		}	}	return true;}