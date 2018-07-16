import argparse
import sys
import time

from typing import List, Dict

from cellstate import *
from colours import player_colours
from player import Player

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

playfield = [[Empty() for i in range(dimensions.width)] for j in
             range(dimensions.height)]  # type: List[List[CellState]]

players = dict()  # type: Dict[int, Player]


def init_player(x, y, player, direction):
    validate_initial_coordinates(x, y)
    initialize_player_owned_area(player, x, y)
    players[player] = Player(x, y, direction)


def initialize_player_owned_area(player, x, y):
    for i in range(y - 1, y + 2):
        for j in range(x - 1, x + 2):
            set_owned_by_player(i, j, player)


def set_owned_by_player(i, j, player):
    playfield[i][j] = Owned(player)


def validate_initial_coordinates(x, y):
    if x == 0 or x == len(playfield[0]) or y == 0 or y == len(playfield):
        raise AttributeError("Illegal parameters")


x, y = dimensions.width / 2, dimensions.height / 2
init_player(x, y, 1, (1, 0))

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':

        # if (time.time() - last_tick > 0.1):
        #     x += dx
        #     y += dy
        #     if playfield[y][x]:
        #         exit()
        #     else:
        #         playfield[y][x] = True
        #         last_tick = time.time()

        x, y = players[1].x, players[1].y

        cell = playfield[y][x]

        if isinstance(cell, Owned):
            if cell.player != 1:
                playfield[y][x] = Trail(1, playfield[y][x])
        else:
            playfield[y][x] = Trail(1, playfield[y][x])

        players[1].update()

        for rowIndex in range(0, len(playfield)):
            row = playfield[rowIndex]
            for colIndex in range(0, len(row)):
                for playerID, player in players.iteritems():
                    if player.x == colIndex and player.y == rowIndex:
                        sys.stdout.write(player_colours[1])
                    else:
                        sys.stdout.write(row[colIndex].getColour())
        sys.stdout.flush()
    elif line[0] == 'P':
        if line[2:5] == 'DU1':
            dx, dy = 0, -1
        elif line[2:5] == 'DD1':
            dx, dy = 0, 1
        elif line[2:5] == 'DR1':
            dx, dy = 1, 0
        elif line[2:5] == 'DL1':
            dx, dy = -1, 0
