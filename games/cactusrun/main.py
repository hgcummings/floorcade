import argparse
import sys
import time

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

playfield = [[False for i in range(dimensions.width)] for j in range(dimensions.height)]
x, y = dimensions.width / 2, dimensions.height / 2
velocity_x, velocity_y = 0, 0
acceleration_x, acceleration_y = 0, 1

playfield[y][x] = True

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        if time.time() - last_tick > 0.1:
            playfield = [[False for i in range(dimensions.width)] for j in range(dimensions.height)]
            y += velocity_y
            velocity_y += acceleration_y
            playfield[y][x] = True

            if x == dimensions.width / 2 and y == dimensions.height / 2:
                velocity_y = 0

            last_tick = time.time()
        for row in playfield:
            for cell in row:
                sys.stdout.write('\xff\xff\xff' if cell else '\x00\x00\x00')
        sys.stdout.flush()
    elif line[0] == 'P':
        if line[2:5] == 'FB1':
            velocity_y = -5
