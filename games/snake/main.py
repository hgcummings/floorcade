import argparse
import sys
import time

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

playfield = [[False for i in range(dimensions.width)] for j in range(dimensions.height)]
x, y = dimensions.width / 2, dimensions.height / 2
dx, dy = 0, -1

playfield[y][x] = True

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        if (time.time() - last_tick > 0.1):
            x += dx
            y += dy
            if playfield[y][x]:
                exit()
            else:
                playfield[y][x] = True
                last_tick = time.time()
        for row in playfield:
            for cell in row:
                sys.stdout.write('\x00\xff\x00' if cell else '\x00\x00\x00')
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
