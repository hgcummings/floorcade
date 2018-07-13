# Floorcade

Arcade games for the dance floor

## Pre-requisites

* [Node.js 10 or higher](https://nodejs.org/)
* (For integration or production mode) [Platform build tools for node-gyp](https://github.com/nodejs/node-gyp#installation)

## Install

* `git clone --recurse-submodules git@github.com:hgcummings/floorcade.git`
* `cd floorcade`
* `npm install`

Note the `--recurse-submodules` argument, which you should add when cloning and pulling. If you forget to include this in the initial clone, run `git submodule update --init`.

## Run

### Individual game test harness

Games can be tested in isolation using the test harness, which provides console-based emulation of the dancefloor display and gamepad input. This does not require the optional dependency `node-hid`.

To run a game using the test harness, execute `harness.js` and pass in the name of the game's directory under the `games` directory, e.g. `node harness.js tetris`

Controller input is emulated via the keyboard using the mapping below. By default, all button presses are emulated as player 1, but you can use the 1-4 keys to switch between players.

```
       Q __                      | |                        __ O
           \  ___________________|_|_____________________  /
          _,-'                                      ____ '-._
        ,'              B U F F A L O           _,-'    `-._ `.
      ,'       ___      Classic USB gamepad   ,'     __ X   `. `.
     /        | W |                          /      /I \      \  \
    /      ___|   |___                      /   __  \__/  __ A \  \
    |     | A       S |      T ,.     Y ,.  |  /J \      /K \   | !
    !     |___     ___|      ,','     ,','  |  \__/  __  \__/   | |
    \         | D |         ','      '.'    \ Y     /M \       /  /
     \        |___|        Select    Start   \      \__/      /  /
      `.                  ___________________ `._  B       _,' ,'
        `-._          _.'`                   `-._`'~-.,-~'`_.'`
            `'~-.,-~'`                           `'~-.,-~'`
```

(Note that controller emulation is based on the standard input stream. A single button press is emulated each time the corresponding character is typed. This means that holding down a key will emulate repeatedly tapping the corresponding button at your system's keyboard repeat rate. For many games, this will have a similar effect to holding down the button, but it may not be identical in all cases.)

### Integration mode

```
npm run dev
```

Must be executed on a machine with the Dancefloor dev server from https://github.com/PhilMarsden/DanceFloorV2 running locally, and with one or more USB gamepads attached. The optional dependency `node-hid` must have installed successfully.

In dev mode, you can use a single gamepad to control multiple players. Cycle between players using the Turbo and Select buttons on the gamepad. These button presses are not exposed as events to the rest of the application.

### Production mode

```
npm run prod
```

Must be executed on a machine on the same network as the dancefloor server, with four USB gamepads attached. The optional dependency `node-hid` must have installed successfully.

## Implementing games

The main application handles hardware controller input and network communication with the dancefloor server. It launches individual games and communicates with them using the protocol below. This means that game implementations only need to deal with standard I/O streams.

### Metadata

Each game **must** be placed in its own directory under the `games` directory. This directory **must** include a `game.json` file containing the following properties:

* `title` the human-readable title of the game, as it will appear in the menu screen (max 14 characters in upper case, or a few more in lower case)
* `command` console command to launch the game
* `players` an object with `min` and `max` properties, each of which is an integer from 1 to 4, defining the supported number of players

### Execution

The game will be launched using the command from `game.json` with two additional arguments, `--width` and `--height`, which describe the display size.

The game process **must** exit when the game has been completed.

### Output

When the game is initialised and ready to run, it **must** send the string `READY\n` to stdout.

After this, each time the game receives a 'tick' event from the parent process (see below) it **must** send exactly `width * height * 3` bytes to stdout. Each byte represents one RGB colour channel in a single pixel of the display (line by line, starting from the top of the screen).

Note that the game **must** write exactly one frame of pixel data to stdout each time it receives a tick event, and **must not** send any other data to stdout (i.e. must not log any other messages to the console). Games may use stderr for debugging purposes.

### Input

Events will be sent to the game on stdin as follows...

Each event consists of five low-ascii characters followed by a newline, i.e. exactly six bytes. When implementing a game, this allows you to read each event as a line, or a fixed number of bytes, or whatever's easiest in your programming language of choice. (Note: in languages with event-based stream consumption, multiple lines may be buffered into a single event, so you may receive 6n bytes at a time rather than always exactly 6. Be sure to process all of them.)

The first byte indicates the event type: `S` for system events and `P` for player events.

#### System events (beginning with `S`)

* `STICK` is a system tick. The game **must** render a single frame of data to stdout (see above) if and only if it receives this event.
* `SKILL` is a system kill. The game **must** exit (i.e. end its process) if it receives this event.

#### Player events (beginning with `P`)

The second byte of a player event is the player number (one-indexed).

The third and fourth bytes represent the button pressed by the player, as per the diagram below (using two-character abbreviations of the [Unreal Engine key codes](https://wiki.unrealengine.com/List_of_Key/Gamepad_Input_Names#Gamepads)).

The final byte indicates if this is a button down (`1`) or button up (`0`) event. For example `P2FR1` indicates that the player two just pressed the A button.

```
      LS __                      | |                        __ RS
           \  ___________________|_|_____________________  /
          _,-'                                      ____ '-._
        ,'              B U F F A L O           _,-'    `-._ `.
      ,'       ___      Classic USB gamepad   ,'     __ X   `. `.
     /        |DU |                          /      /FT\      \  \
    /      ___|   |___                      /   __  \__/  __ A \  \
    |     |DL       DR|     SL ,.    SR ,.  |  /FL\      /FR\   | !
    !     |___     ___|      ,','     ,','  |  \__/  __  \__/   | |
    \         | DD|         ','      '.'    \ Y     /FB\       /  /
     \        |___|        Select    Start   \      \__/      /  /
      `.                  ___________________ `._  B       _,' ,'
        `-._          _.'`                   `-._`'~-.,-~'`_.'`
            `'~-.,-~'`                           `'~-.,-~'`
```

### Deployment

Games should be checked into the master branch of the floorcade git repo. At startup, the console performs the following steps:

* git pull --recurse-submodules
* For any new/changed directories under `games`, if the folder contains an `install.sh` script, execute it

Note that each game's install script should be idempotent, and will only run when there have been code changes within the game's directory.
