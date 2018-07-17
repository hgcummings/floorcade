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

def remove_player(player_id):
    del players[player_id]
    for rowIndex, row in enumerate(playfield):
        for colIndex, cell in enumerate(playfield[rowIndex]):
            if isinstance(cell, Trail):
                if cell.player == player_id:
                    playfield[rowIndex][colIndex] = cell.replaced_cell


x, y = dimensions.width / 2, dimensions.height / 2
init_player(x, y, 1, (1, 0))

set_owned_by_player(10, 10, 2)

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        for player_id in players.keys():
            player = players[player_id]
            x, y = player.x, player.y

            cell = playfield[y][x]
            if isinstance(cell, Trail):
                remove_player(cell.player)
            else:
                if isinstance(cell, Owned):
                    if cell.player != player_id:
                        playfield[y][x] = Trail(player_id, playfield[y][x])
                else:
                    playfield[y][x] = Trail(player_id, playfield[y][x])

                player.update()

        for rowIndex in range(0, len(playfield)):
            row = playfield[rowIndex]
            for colIndex in range(0, len(row)):
                no_players = True
                for playerID, player in players.iteritems():
                    if player.x == colIndex and player.y == rowIndex:
                            sys.stdout.write(player_colours[player_id])
                            no_players = False
                if no_players:
                    sys.stdout.write(row[colIndex].getColour())
                
        sys.stdout.flush()
    elif line[0] == 'P':
        playerNum = int(line[1])
        if playerNum in players.keys():
            if line[2:5] == 'DU1':
                players[playerNum].setDirection(0, -1)
            elif line[2:5] == 'DD1':
                players[playerNum].setDirection(0, 1)
            elif line[2:5] == 'DR1':
                players[playerNum].setDirection(1, 0)
            elif line[2:5] == 'DL1':
                players[playerNum].setDirection(-1, 0)
