/*
	Ario
*/

importPackage(net.sf.odinms.world);
importPackage(net.sf.odinms.client);
importPackage(net.sf.odinms.server.maps);
importPackage(java.lang);
importPackage(net.sf.odinms.server.life);

var exitMap;
var minPlayers = 1;
var tylus;
var shouldSchedule;

function init() {
	exitMap = em.getChannelServer().getMapFactory().getMap(211000001); // exit map
	em.setProperty("ElNathPQOpen", "true"); // allows entrance.
}

function monsterValue(eim, mobId) {
	return 1;
}

function setup() {
	var eim = em.newInstance("ElNathPQ");
	em.schedule("timeOut", 60000 * 8);
	var eventTime = 8 * 60000;
	em.schedule("timeOut", eim, eventTime);
	tylus = net.sf.odinms.server.life.MapleLifeFactory.getMonster(9300093);
	eim.getMapInstance(921100300).spawnMonsterOnGroundBelow(tylus, new java.awt.Point(-379, -93));
	tylus.setHp(200000);
	eim.registerMonster(tylus);
	em.schedule("HPCheck", 2000);
	eim.startEventTimer(eventTime);
	return eim;
}

function playerEntry(eim, player) {
	var map = eim.getMapInstance(921100300);
	player.changeMap(map, map.getPortal(0));
	player.getClient().getSession().write(net.sf.odinms.tools.MaplePacketCreator.serverNotice(6, "Please protect Tylus for 5 minutes. You may leave the map with 3 minutes remaining."));
}

function playerDead(eim, player) {}

function playerRevive(eim, player) {
	player.setHp(50);
	player.setStance(0);
    var party = eim.getPlayers();
    if (eim.isLeader(player) || party.size() <= minPlayers) { // Check for party leader
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            playerExit(eim, party.get(i));
        }
        eim.dispose();
    } else
        playerExit1(eim, player);
}

function playerDisconnected(eim, player) {
    var party = eim.getPlayers();
    if (eim.isLeader(player) || party.size() <= minPlayers) { // Check for party leader or party size less than minimum players.
        // Boot whole party and end
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            if (party.get(i).equals(player)) {
                removePlayer(eim, player); // Sets map only. Cant possible changeMap because player is offline.
            } else {
                playerExit(eim, party.get(i)); // Removes all other characters from the instance.
            }
        }
        eim.dispose();
    } else { // non leader.
        removePlayer1(eim, player); // Sets map only. Cant possible changeMap because player is offline.
    }
}

function leftParty(eim, player) {			
    var party = eim.getPlayers();
    if (party.size() <= minPlayers) {
        for (var i = 0; i < party.size(); i++) {
            playerExit(eim,party.get(i));
        }
        eim.dispose();
    } else
        playerExit1(eim, player);
}

function disbandParty(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function playerExit(eim, player) {
	eim.unregisterPlayer(player);
	player.changeMap(exitMap, exitMap.getPortal(0));
	em.setProperty("ElNathPQOpen", "true");
}

function playerExit1(eim, player) {
	eim.unregisterPlayer(player);
	player.changeMap(exitMap, exitMap.getPortal(0));
}

function removePlayer(eim, player) { // set players map since they aren't connect anymore
	eim.unregisterPlayer(player);
	player.getMap().removePlayer(player);
	player.setMap(exitMap);
	em.setProperty("ElNathPQOpen", "true");
}

function removePlayer1(eim, player) { // set players map since they aren't connect anymore
	eim.unregisterPlayer(player);
	player.getMap().removePlayer(player);
	player.setMap(exitMap);
}

function allMonstersDead(eim) {}

function cancelSchedule() {}

function timeOut(eim) {
	if (eim != null) {
		if (eim.getPlayerCount() > 0) {
			var pIter = eim.getPlayers().iterator();
			while (pIter.hasNext()) {
				playerExit(eim, pIter.next());
			}
		}
		//eim.dispose();
	}
}

function HPCheck(eim, player) {
	var iter = em.getInstances().iterator();
	shouldSchedule = true;
	while (iter.hasNext()) 	{
		var eim = iter.next();
		if (eim.getPlayerCount() > 0) {
		var pIter = eim.getPlayers().iterator();
		if (tylus.getHp() == 0) {
			while (pIter.hasNext()) {
				pIter.next().getClient().getSession().write(net.sf.odinms.tools.MaplePacketCreator.serverNotice(6,"You have failed to protect Tylus from the monsters."));
			}
			shouldSchedule = false;
			eim.getMapInstance(921100300).killAllMonsters(false);
			eim.unregisterMonster(tylus);
			disbandParty(eim); // boot party
		}
	}
	}
	if (shouldSchedule && eim != null) {
		em.schedule("HPCheck", 2000);
	}
}