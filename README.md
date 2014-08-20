dnv3a is (was) an HTML/JavaScript frontend to [Dueling Network](http://duelingnetwork.com), made as a school project.

A screenshot:

![screenshot](http://i.imgur.com/9AJ0Lof.png)

Server side changes has broken it, but it's still possible to simulate old duels by following this procedure:
- Go to login.js, change Connect15 to Connect21 (or whatever the version number is nowadays - you can see it with WireShark or trial and error).
- Go to debug.js, uncommon the line that says `this.replay('watch');`. Pick one of the id's "watch", "watch2", "watch3" or "watch4".
- Open src/index.html over some protocol other than file:///.
- Log in, press `d` for duel, then click the `+` button in the lower-left corner repeatedly.

The `flash/` directory contains a disassembled version of Dueling Network's swf file, created using SoThink SWF Decompiler.

The `ff-ext/` directory contains a defunct Firefox extension that was supposed to be used for network communication. `src/swf-communicator/` replaces it, together with `src/js/communicator.js` (I think this works because of some crossdomain.xml file somewhere).

Licencing is a bit unclear. Everything below `src/`, `swf-communicator` and `ff-ext/`, except `src/img/`, may be used under the BSD licence. `src/img/` contains files from Dueling Network - ask them about licencing. Card images are hotlinked directly from duelingnetwork.com, although I think they stole them from elsewhere. `notes/` is public domain.
