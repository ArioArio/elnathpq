/* 
 * Exit Portal for El Nath PQ
 */

function enter(pi) 
{
	var eim = pi.getPlayer().getEventInstance();
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++)
        {
             eim.removePlayer(party.get(i));  
        }
        return true;
}

