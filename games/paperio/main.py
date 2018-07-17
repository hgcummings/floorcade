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

def check_valid_coordinates(x, y):
    if x < 0 or x >= len(playfield[0]) or y <= 0 or y >= len(playfield):
        return False
    return True

def validate_initial_coordinates(x, y):
    if not check_valid_coordinates(x, y) or x == 0 or x == len(playfield[0]) or y == 0 or y == len(playfield):
        raise AttributeError("Illegal parameters")

def remove_player(player_id):
    del players[player_id]
    for rowIndex, row in enumerate(playfield):
        for colIndex, cell in enumerate(row):
            if isinstance(cell, Trail):
                if cell.player == player_id:
                    playfield[rowIndex][colIndex] = cell.replaced_cell

def check_own_connected(coord1, coord2):
    x1, y1 = coord1
    x2, y2 = coord2
    if not isinstance(playfield[y1][x1], Owned) or not isinstance(playfield[y2][x2], Owned):
        return False
    if playfield[y1][x1].player != playfield[y2][x2].player:
        return False
    player_id = playfield[y1][x1].player
    explore_directions = [(-1, 0), (0, -1), (1, 0), (0, 1)]
    visited = []
    queue = [coord1]
    while len(queue) > 0:
        x, y = queue.pop(0)
        visited.append((x, y))
        if x == x2 and y == y2:
            return True
        for dx, dy in explore_directions:
            if check_valid_coordinates(x + dx, y + dy):
                if isinstance(playfield[y + dy][x + dx], Owned):
                    if playfield[y + dy][x + dx].player == player_id:
                        if (x + dx, y + dy) not in visited:
                            queue.append((x + dx, y + dy))
    return False

def trail_completed(player_id):
    trail_start = players[player_id].get_trail_start()
    players[player_id].clear_trail_start()

    trail_end = players[player_id].x, players[player_id].y

    # Fill the trail
    for row in playfield:
        for colIndex, cell in enumerate(row):
            if isinstance(cell, Trail):
                if cell.player == player_id:
                    row[colIndex] = Owned(player_id)

    if check_own_connected(trail_start, trail_end):
        # TODO: fill the area
        pass


x, y = dimensions.width / 2, dimensions.height / 2
init_player(x, y, 1, (1, 0))
init_player(x - 10, y - 5, 2, (1, 0))

set_owned_by_player(10, 10, 1)

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
                    if cell.player == player_id and player.trail_start_set:
                        trail_completed(player_id)
                    else:
                        playfield[y][x] = Trail(player_id, playfield[y][x])
                        players[player_id].set_trail_start(x - player.dx, y - player.dy)
                else:
                    playfield[y][x] = Trail(player_id, playfield[y][x])
                    players[player_id].set_trail_start(x, y)

                player.update()
                if not check_valid_coordinates(player.x, player.y):
                    remove_player(player_id)

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
