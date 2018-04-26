	/*
	 * Tylus (After Clearing El Nath PQ)
	 * Ario
	 */
	
function start() {
	status = -1;
	action(1, 0, 0);
}
	
	function action(mode, type, selection) {
	    if (mode == 1) {
	        status++;
	    } else {
	        status--;
	    }
	    if (status == 0) {
	        if (cm.getQuestStatus(6192) == "STARTED") {
	            cm.sendNext("Thank you for guarding me. I could do my mission thanks to you. Talk to me when you're out.");
	        } else {
	            cm.warp(211000001, 0);
	            cm.dispose();
	        }
	    } else if (status == 1) {
	        if (!cm.haveItem(4031495)) {
	            {cm.gainItem(4031495, 1);
	             cm.warp(211000001, 0);
	             cm.dispose();
				}
	            } else {
	            cm.warp(211000001, 0);
	            cm.dispose();
	        }
	   }
	}