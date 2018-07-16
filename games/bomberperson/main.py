import argparse
import sys
import time
import random
from color import Color
from tile import Tile
from player import Player

random.seed()

def wall():
    return Tile(False, Color(50,50,50))

def box():
    return Tile(False, Color(150,150,150), True)

def floor():
    return Tile(True, Color(0,200,0))

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

SCALE = 2
WIDTH = dimensions.width/SCALE
HEIGHT=  dimensions.height/SCALE

players = [
    Player(3,3,Color(255,0,255)),
    Player(WIDTH-3,3,Color(255,0,0)),
    Player(WIDTH-3,HEIGHT-3,Color(255,255,0)),
    Player(3,HEIGHT-3,Color(0,255,255))
]

playfield = [[box() if random.random() > 0.4 else floor() for i in range(WIDTH)] for j in range(HEIGHT)]
for i in range(WIDTH):
    playfield[0][i] = wall()
    playfield[1][i] = wall()
    playfield[HEIGHT-1][i] = wall()

for i in range(HEIGHT):
    playfield[i][0] = wall()
    playfield[i][1] = wall()
    playfield[i][WIDTH-1] = wall()

for i in xrange(0, WIDTH, 2):
    for j in xrange(0, HEIGHT, 2):
        playfield[j][i] = wall()

playfield[3][3] = floor()
playfield[3][4] = floor()
playfield[4][3] = floor()
playfield[3][WIDTH-3] = floor()
playfield[4][WIDTH-3] = floor()
playfield[3][WIDTH-4] = floor()
playfield[HEIGHT-3][3] = floor()
playfield[HEIGHT-4][3] = floor()
playfield[HEIGHT-3][4] = floor()
playfield[HEIGHT-3][WIDTH-3] = floor()
playfield[HEIGHT-4][WIDTH-3] = floor()
playfield[HEIGHT-3][WIDTH-4] = floor()

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        tick = time.time() - last_tick > 0.1
        if tick:
            for player in players:
                player.tick(playfield)

        for j in range(dimensions.height):
            for i in range(dimensions.width):
                if tick:
                    playfield[j/SCALE][i/SCALE].tick(playfield)
                sys.stdout.write(playfield[j/SCALE][i/SCALE].draw())
        sys.stdout.flush()

        if tick:
            last_tick = time.time()
    elif line[0] == 'P' and line[2] == 'D' and line[4] == '1':
        players[int(line[1])-1].intent = line[3]
    elif line[0] == 'P' and line[2] == 'D' and line[4] == '0' and players[int(line[1])-1].intent == line[3]:
        players[int(line[1])-1].intent = None
    elif line[0] == 'P' and line[2] == 'F' and line[4] == '1':
        players[int(line[1])-1].intent = 'B'
