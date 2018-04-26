function enter(pi) 
{
	var eim = pi.getPlayer().getEventInstance();
	if (eim == null) {
	    pi.warp(211000001, 0);
	} else {
	    if (eim.getTimeLeft() < 180000 && pi.isLeader()) 
            { // 3 minutes left
		pi.warp(921100301, 0);
	    } 
            else 
            {
		pi.playerMessage("Please protect Tylus from kidnappers!");
		return false;
	    }
	}
    return true;
}