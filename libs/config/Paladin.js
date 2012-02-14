// Paladin config file

/* Brief instructions:
 * Notepad++ is HIGHLY recommended to use for editing these files. Visit http://notepad-plus-plus.org/
 * To comment out something, put // in front of that line
 * !!!Never comment out something you're not sure about, set it to false or disable as noted in description if you don't want to use it.
 * true and false are case sensitive. Good: Config.SomeVar = true; Bad: Config.SomeVar = True;
 */

function LoadConfig() {
	/* Sequence config
	 * Set to true if you want to run it, set to false if not.
	 * If you want to change the order of the scripts, just change the order of their lines by using cut and paste.
	 */
	 
	// User addon script. Read the description in libs/bots/UserAddon.js
	Scripts.UserAddon = true; // !!!YOU MUST SET THIS TO FALSE IF YOU WANT TO RUN BOSS/AREA SCRIPTS!!!

	// Boss/area scripts
	
	// *** act 1 ***
	Scripts.Mausoleum = false;
		Config.Mausoleum.KillBloodRaven = true;
	Scripts.Rakanishu = false;
		Config.Rakanishu.KillGriswold = true;
	Scripts.Pit = false;
		Config.Pit.ClearPit1 = true;
	Scripts.Countess = false;
	Scripts.Andariel = false;
	
	// *** act 2 ***
	Scripts.AncientTunnels = false;
	Scripts.Duriel = false;
	
	// *** act 3 ***
	Scripts.KurastChests = false;
	Scripts.Travincal = false;
	Scripts.Mephisto = false;
	
	// *** act 4 ***
	Scripts.Izual = false;
	Scripts.Vizier = false; // Intended for classic sorc, kills Vizier only.
	Scripts.FastDiablo = false;
	
	// *** act 5 ***
	Scripts.Pindleskin = false;
		Config.Pindleskin.KillNihlathak = true;
	Scripts.Eldritch = false;
		Config.Eldritch.OpenChest = true;
		Config.Eldritch.KillShenk = true;
		Config.Eldritch.KillDacFarren = true;
	Scripts.Abaddon = false;
	Scripts.Frozenstein = false;
		Config.Frozenstein.ClearFrozenRiver = true;
	Scripts.Bonesaw = false;
	Scripts.Snapchip = false;
		Config.Snapchip.ClearIcyCellar = true;
	Scripts.Baal = false;
	Scripts.AutoBaal = false;
		Config.AutoBaal.FindShrine = false;

	// *** special scripts ***
	Scripts.CrushTele = false;
	Scripts.Questing = false;


	// Town settings
	Config.HealHP = 50; // Go to a healer if under designated percent of life.
	Config.HealMP = 0; // Go to a healer if under designated percent of mana.
	Config.UseMerc = true; // Revive merc if he/she dies. This is ignored and always false in d2classic.

	// Potion settings
	Config.UseHP = 75; // Drink a healing potion if life is under designated percent.
	Config.UseRejuvHP = 40;  // Drink a rejuvenation potion if life is under designated percent.
	Config.UseMP = 30; // Drink a mana potion if mana is under designated percent.
	Config.UseRejuvMP = 0; // Drink a rejuvenation potion if mana is under designated percent.
	Config.UseMercHP = 75; // Give a healing potion to your merc if his/her life is under designated percent.
	Config.UseMercRejuv = 0; // Give a rejuvenation potion to your merc if his/her life is under designated percent.
	Config.RejuvBuffer = 0; // Number of rejuvenation potions to keep in inventory.

	// Chicken settings
	Config.LifeChicken = 30; // Exit game if life is less or equal to designated percent.
	Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
	Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.

	/* Inventory lock configuration. !!!READ CAREFULLY!!!
	 * 0 = item is locked and won't be moved. If item occupies more than one slot, ALL of those slots must be set to 0 to lock it in place.
	 * Put 0s where your torch, annihilus and everything else you want to KEEP is.
	 * 1 = item is unlocked and will be dropped, stashed or sold.
	 * If you don't change the default values, the bot won't stash items.
	 */
	Config.Inventory[0] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[1] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[2] = [0,0,0,0,0,0,0,0,0,0];
	Config.Inventory[3] = [0,0,0,0,0,0,0,0,0,0];

	Config.StashGold = 100000; // Minimum amount of gold to stash.

	/* Potion types for belt columns from left to right.
	 * Rejuvenation potions must always be rightmost.
	 * Supported potions - Healing ("hp"), Mana ("mp") and Rejuvenation ("rv")
	 */
	Config.BeltColumn[0] = "hp";
	Config.BeltColumn[1] = "mp";
	Config.BeltColumn[2] = "rv";
	Config.BeltColumn[3] = "rv";

	/* Minimum amount of potions. If we have less, go to vendor to purchase more.
	 * Set rejuvenation columns to 0, because they can't be bought.
	 */
	Config.MinColumn[0] = 3;
	Config.MinColumn[1] = 3;
	Config.MinColumn[2] = 0;
	Config.MinColumn[3] = 0;

	// Pickit config
	Config.PickitFiles.push("kolton.nip"); // Pickit filenames in /pickit/ folder
	Config.PickitFiles.push("LLD.nip");
	Config.PickRange = 40; // Pick radius

	// Gambling config
	Config.Gamble = true;
	Config.GambleGoldStart = 1000000;
	Config.GambleGoldStop = 500000;
	
	// Check libs/njipAliases.dbl file for other item classids
	Config.GambleItems.push(520); // Amulet
	Config.GambleItems.push(522); // Ring
	Config.GambleItems.push(418); // Circlet
	Config.GambleItems.push(419); // Coronet
	
	// Cubing config. All recipes will be available in Templates/Cubing.txt
	Config.Cubing = false; // Set to true to enable cubing.

	// All ingredients will be auto-picked, for classids check libs/njipAliases.dbl
	Config.Recipes.push([Recipe.Rune, 630]); // pul -> um
	Config.Recipes.push([Recipe.Rune, 631]); // um -> mal
	Config.Recipes.push([Recipe.Rune, 632]); // mal -> ist
	Config.Recipes.push([Recipe.Rune, 633]); // ist -> gul
	Config.Recipes.push([Recipe.Rune, 634]); // gul -> vex
	
	Config.Recipes.push([Recipe.Caster.Amulet]); // Craft Caster Amulet
	Config.Recipes.push([Recipe.Blood.Ring]); // Craft Blood Ring
	Config.Recipes.push([Recipe.Blood.Helm, 424]); // Craft Blood Armet
	Config.Recipes.push([Recipe.HitPower.Glove, 452]); // Craft Hit Power Vambraces

	Config.Recipes.push([Recipe.Reroll.Magic, 421]); // Reroll magic Diadem
	Config.Recipes.push([Recipe.Reroll.Rare, 421]); // Reroll rare Diadem

	// Base item must be in the pickit, rest is auto-picked
	Config.Recipes.push([Recipe.Socket.Weapon, 255]); // Socket Thresher
	Config.Recipes.push([Recipe.Socket.Weapon, 256]); // Socket Cryptic Axe
	Config.Recipes.push([Recipe.Socket.Armor, 442]); // Socket Sacred Armor
	Config.Recipes.push([Recipe.Socket.Armor, 443]); // Socket Archon Plate
	
	/* Runeword config. All recipes will be available in Templates/Cubing.txt
	 * !!!NOTE!!! enhanced damage and enhanced defense on runewords are broken in the core right now
	 * Keep lines follow pickit format and any given runeword is tested vs ALL lines so you don't need to repeat them
	 */
	Config.MakeRunewords = true; // Set to true to enable runeword making/rerolling

	Config.Runewords.push([Runeword.Insight, 255]); // Thresher
	Config.Runewords.push([Runeword.Insight, 256]); // Cryptic Axe

	Config.KeepRunewords.push("[type] == polearm # [meditationaura] == 17");

	Config.Runewords.push([Runeword.Spirit, 447]); // Monarch
	Config.Runewords.push([Runeword.Spirit, 498]); // Sacred Targe

	Config.KeepRunewords.push("[type] == shield || [type] == auricshields # [fcr] == 35");

	// General config
	Config.PublicMode = false; // Controls party invite/accept and town portals for other players.
	Config.QuitList = []; // List of players to quit with. Example: Config.QuitList = ["MySorc", "MyDin"];
	Config.MinGameTime = 60; // Min game time in seconds. Bot will stay in game if the run is completed before.
	Config.OpenChests = false; // Open chests. Controls key buying.

	/* Attack config
	 * To disable an attack, set it to -1
	 * Skills MUST be POSITIVE numbers. For reference see http://pastebin.com/baShRwWM
	 */
	Config.AttackSkill[0] = -1; // Preattack skill. Not implemented yet.
	Config.AttackSkill[1] = -1; // Primary skill to bosses.
	Config.AttackSkill[2] = -1; // Primary aura to bosses
	Config.AttackSkill[3] = -1; // Primary skill to others.
	Config.AttackSkill[4] = -1; // Primary aura to others.
	Config.AttackSkill[5] = -1; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = -1; // Secondary aura.

	Config.BossPriority = false; // Set to true to attack Unique/SuperUnique monsters first when clearing
	Config.ClearType = 0xF; // Monster spectype to kill in level clear scripts (ie. Mausoleum).

	// Class specific config
	Config.Vigor = true; // Swith to Vigor when running
	Config.Redemption = [50, 50]; // Switch to Redemption after clearing an area if under designated life or mana. Format: [lifepercent, manapercent]
}