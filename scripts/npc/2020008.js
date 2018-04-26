/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
   Ario
*/

/* Tylus
	Warrior 3rd job advancement
	El Nath: Chief's Residence (211000001)
	
	Custom Quest 100100, 100102
*/

importPackage(net.sf.odinms.client);
importPackage(net.sf.odinms.tools);

var status = 0;
var job;
var minLevel = 120;
var maxLevel = 200;
var minPlayers = 1;
var maxPlayers = 6;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (mode == 0 && status == 1) {
			cm.sendOk("Make up your mind and visit me again.");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			if (cm.getQuestStatus(6192).equals(MapleQuestStatus.Status.STARTED)) {
			if (cm.getParty() == null) { // check if in party
						cm.sendOk("How about you and your party members work together to complete the quest? Here you'll find obstacles that you won't be able to surpass without some teamwork.");
						cm.dispose();
						return;
					}
					if (!cm.isLeader()) { // check for party leader
						cm.sendOk("If you want to begin the quest, please tell the #e#bParty Leader#k#n to talk to me.");
						cm.dispose();
						return;
					}
					if (cm.getParty().getMembers().size() < minPlayers || cm.getParty().getMembers().size() > maxPlayers) { // check for min and max number of players
						cm.sendOk("You must have at least #e#b" + minPlayers + "#n#k players in your party in order to participate in this party quest.");
						cm.dispose();
						return;
					}
					if (cm.partyMembersInMap() != cm.getParty().getMembers().size()) { // check for all players are present
						cm.sendOk("Not all members of your party are present. Please make sure that everyone is here in order to being the quest.");
						cm.dispose();
						return;
					}
					else {
					var party = cm.getParty().getMembers(); // Collect all party members in "party" list
					var inMap = cm.partyMembersInMap(); // Collect all party members in map in "inMap" list
					var levelValid = 0; // counts the members between minlevel and maxlevel. 
					for (var i = 0; i < party.size(); i++) { // For every party member
					if (party.get(i).getLevel() >= minLevel && party.get(i).getLevel() <= maxLevel) 
                                        levelValid++; // Count how many players are valid to join
					} 
					if (levelValid != inMap) {
					cm.sendOk("Please make sure all your members are present and qualified to participate in this party quest. El Nath PQ requires players ranging from level "+minLevel+" to level "+maxLevel+". I see #b#e" + levelValid + "#k#n members are in the right level range. If this seems incorrect, relog or reform the party.");
					cm.dispose();
					} else {
					var em = cm.getEventManager("ElNathPQ"); // Create new event instance of El nath PQ
                                        if (em == null) {
                                            cm.sendOk("This PQ is not currently available.");
                                        }  
                                        else if (!em.getProperty("ElNathPQOpen").equals("true")) { // Someone is inside
						cm.sendOk("Another party is already inside. Please wait.");
						cm.dispose();
						return;
					}
					// send party into the pq
					em.startInstance(cm.getParty(), cm.getPlayer().getMap());
					em.setProperty("ElNathPQOpen" , "false"); // close off the pq
					cm.dispose();
				}
			}
			} else if (!(cm.getJob().equals(MapleJob.FIGHTER) ||
				cm.getJob().equals(MapleJob.PAGE) ||
				cm.getJob().equals(MapleJob.SPEARMAN))) {
				cm.sendOk("And...who might you be?");
				cm.dispose();
				return;
			}
			else if (cm.getQuestStatus(100102).equals(MapleQuestStatus.Status.COMPLETED)) {
				cm.sendNext("Indeed, you have proven to be worthy of the strength I will now bestow upon you.");
			} else if (cm.getQuestStatus(100102).equals(MapleQuestStatus.Status.STARTED)) {
				cm.sendOk("Go and find me the #rNecklace of Wisdom#k which is hidden on the Holy Ground at the Snowfield.");
				cm.dispose();
			} else if (cm.getQuestStatus(100101).equals(MapleQuestStatus.Status.COMPLETED)) {
				cm.sendNext("I was right, your strength is truly excellent.");
			} else if (cm.getQuestStatus(100100).equals(MapleQuestStatus.Status.STARTED)) {
				cm.sendOk("Well, well. Now go and see #bDances with Balrog#k. He will show you the way.");
				cm.dispose();
			} else if ((cm.getJob().equals(MapleJob.FIGHTER) ||
				cm.getJob().equals(MapleJob.PAGE) ||
				cm.getJob().equals(MapleJob.SPEARMAN)) &&
				cm.getLevel() >= 70 && 
				cm.getChar().getRemainingSp() <= (cm.getLevel() - 70) * 3) {
				cm.sendNext("You are a strong one.");
			} else {
				cm.sendOk("Your time has yet to come...");
				cm.dispose();
			}
		} else if (status == 1) {
			if (cm.getQuestStatus(100102).equals(MapleQuestStatus.Status.COMPLETED)) {
				if (cm.getJob().equals(MapleJob.FIGHTER ) && cm.getLevel() >= 70) {
					cm.changeJob(MapleJob.CRUSADER);
					cm.getChar().gainAp(5);
					cm.sendOk("You are now a #bCrusader#k!");
					//cm.getPlayer().getClient().getChannelServer().broadcastPacket(MaplePacketCreator.serverNotice(6, "[Job Advancement] Congratulations to " +cm.getPlayer().getName()+ " on becoming a Crusader."));
					cm.getPlayer().getClient().getChannelServer().getInstance(cm.getPlayer().getClient().getChannel()).getWorldInterface().broadcastMessage(cm.getPlayer().getName(), MaplePacketCreator.serverNotice(6, "[3rd Job] Congratulations to " +cm.getPlayer().getName()+ " on becoming a Crusader!").getBytes());
					cm.dispose();
				} else if (cm.getJob().equals(MapleJob.PAGE) && cm.getLevel() >= 70) {
					cm.changeJob(MapleJob.WHITEKNIGHT);
					cm.getChar().gainAp(5);
					cm.sendOk("You are now a #bWhite Knight#k!");
					//cm.getPlayer().getClient().getChannelServer().broadcastPacket(MaplePacketCreator.serverNotice(6, "[Job Advancement] Congratulations to " +cm.getPlayer().getName()+ " on becoming a White Knight."));
					cm.getPlayer().getClient().getChannelServer().getInstance(cm.getPlayer().getClient().getChannel()).getWorldInterface().broadcastMessage(cm.getPlayer().getName(), MaplePacketCreator.serverNotice(6, "[3rd Job] Congratulations to " +cm.getPlayer().getName()+ " on becoming a White Knight!").getBytes());
					cm.dispose();
				} else if (cm.getJob().equals(MapleJob.SPEARMAN) && cm.getLevel() >= 70) {
					cm.changeJob(MapleJob.DRAGONKNIGHT);
					cm.getChar().gainAp(5);
					cm.sendOk("You are now a #bDragon Knight#k!");
					//cm.getPlayer().getClient().getChannelServer().broadcastPacket(MaplePacketCreator.serverNotice(6, "[Job Advancement] Congratulations to " +cm.getPlayer().getName()+ " on becoming a Dragon Knight."));
					cm.getPlayer().getClient().getChannelServer().getInstance(cm.getPlayer().getClient().getChannel()).getWorldInterface().broadcastMessage(cm.getPlayer().getName(), MaplePacketCreator.serverNotice(6, "[3rd Job] Congratulations to " +cm.getPlayer().getName()+ " on becoming a Dragon Knight!").getBytes());
					cm.dispose();
				}
			} else if (cm.getQuestStatus(100100).equals(MapleQuestStatus.Status.COMPLETED)) {
				cm.sendAcceptDecline("Is your mind ready to undertake the final test?");
			} else if (cm.getQuestStatus(100101).equals(MapleQuestStatus.Status.COMPLETED) && cm.haveItem(4031057)) {
				cm.sendAcceptDecline("However, you will have to prove not only your strength, but also your knowledge. Are you ready for the challenge?");
			} else {
				cm.sendAcceptDecline("But I can make you even stronger. Prove to me that you a ready by passing my test! Are you ready for the challenge?");
			}
		} else if (status == 2) {
			if (cm.getQuestStatus(100101).equals(MapleQuestStatus.Status.COMPLETED) && cm.haveItem(4031057)) {
				cm.startQuest(100102);
				cm.gainItem(4031057, -1);
				cm.sendOk("Go and find me the #rNecklace of Wisdom#k which is hidden on the Holy Ground at the Snowfield.");
				cm.dispose();
			} else {
				cm.startQuest(100100);
				cm.sendOk("Well, well. Now go and see #bDances with Balrog#k. He will show you the way.");
				cm.dispose();
			}
		}
	}
}	
