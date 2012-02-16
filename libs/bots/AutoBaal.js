/* 	
	Universal Baal leecher by Kolton with Autoleader by Ethic
	Pure leech script for throne and Baal
	Reenters throne/chamber upon death and picks the corpse back up
	Make sure you setup safeMsg and baalMsg accordingly
*/

function AutoBaal() {
	// editable variables
	var safeMsg = ["safe", "throne clear", "leechers can come", "tp is up", "1 clear"], // safe message - casing doesn't matter
		baalMsg = ["baal", "submortal"], // baal message - casing doesn't matter
		hotMsg = ["hot"], // used for shrine hunt
	// internal variables
		i, baalCheck, throneCheck, hotCheck, leader, suspect, solofail, portal;

	addEventListener('chatmsg', // chat event, listen to what leader says
		function (nick, msg) { // handler function
			var i;

			if (nick === leader) { // filter leader messages
				for (i = 0; i < hotMsg.length; i = i + 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(hotMsg[i].toLowerCase()) > -1) { // leader says a hot tp message
						hotCheck = true; // safe to enter baal chamber
						break;
					}
				}

				for (i = 0; i < safeMsg.length; i = i + 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(safeMsg[i].toLowerCase()) > -1) { // leader says a safe tp message
						throneCheck = true; // safe to enter throne
						break;
					}
				}

				for (i = 0; i < baalMsg.length; i = i + 1) { // loop through all predefined messages to find a match
					if (msg.toLowerCase().indexOf(baalMsg[i].toLowerCase()) > -1) { // leader says a baal message
						baalCheck = true; // safe to enter baal chamber
						break;
					}
				}
			}
		}
	);

	function AutoLeaderDetect(destination) { // autoleader by Ethic
		do {
			solofail = 0;
			suspect = getParty(); // get party object (players in game)

			do {
				if (suspect.name !== me.name) { // player isn't alone
					solofail += 1;
				}

				if (suspect.area === destination) { // first player in our party found in destination area...
					leader = suspect.name; // ... is our leader
					print("�c4AutoBaal: �c0Autodetected " + leader);
					return true;
				}
			} while (suspect.getNext()); 

			if (solofail === 0) { // empty game, nothing left to do
				return false;
			}

			delay(500);
		} while (!leader); // repeat until leader is found (or until game is empty)

		return false;
	}

	if (!Town.goToTown(5)) {
		throw new Error("Town.goToTown failed."); // critical error - can't reach harrogath
	}

	Town.doChores();
	Town.move("portalspot");

	if (AutoLeaderDetect(131)) { // find the first player in area 131 - throne of destruction
		while (Misc.inMyParty(leader)) { // do our stuff while partied
			if (hotCheck && Config.AutoBaal.FindShrine) {
				Pather.useWaypoint(4);

				for (i = 4; i > 1; i -= 1) {
					if (Misc.getShrinesInArea(i, 15)) {
						break;
					}
				}

				if (i === 1) {
					Town.goToTown();
					Pather.useWaypoint(5);

					for (i = 5; i < 8; i += 1) {
						if (Misc.getShrinesInArea(i, 15)) {
							break;
						}
					}
				}

				Town.goToTown(5);
				Town.move("portalspot");

				hotCheck = false;
			}

			if (throneCheck && me.area === 109) { // wait for throne signal - leader's safe message
				print("�c4AutoBaal: �c0Trying to take TP to throne.");
				Pather.usePortal(131, leader); // take TP to throne
				delay(500);
				Pather.moveTo(15113, 5050); // move to a safe spot
				Precast.doPrecast(true);
				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

			if (baalCheck && me.area === 131) { // wait for baal signal - leader's baal message
				Pather.moveTo(15092, 5010); // move closer to chamber portal
				Precast.doPrecast(true);

				while (getUnit(1, 543)) { // wait for baal to go through the portal
					delay(500);
				}

				portal = getUnit(2, 563);

				delay(5000); // wait for others to enter first - helps  with curses and tentacles from spawning around you
				print("�c4AutoBaal: �c0Entering chamber.");

				if (Pather.usePortal(null, null, portal)) { // enter chamber
					Pather.moveTo(15166, 5903); // go to a safe position
				}

				Town.getCorpse(); // check for corpse - happens if you die and reenter
			}

			if (me.mode === 17) { // death check
				me.revive(); // revive if dead
			}

			delay(500);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
}