import argparse
import sys
import time
from runner import Runner
from point import Point

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

playfield = [[False if (j != dimensions.height/2+1) else True for i in range(dimensions.width)] for j in range(dimensions.height)]

coords = Point(dimensions.width / 2, dimensions.height / 2)
runner = Runner(coords)

acceleration_x, acceleration_y = 0, 1

playfield[runner.coords.y][runner.coords.x] = True

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        if time.time() - last_tick > 0.1:
            playfield = [[False if (j != dimensions.height / 2 + 1) else True for i in range(dimensions.width)] for j in
                         range(dimensions.height)]
            runner.coords.y += runner.velocity.y
            runner.velocity.y += acceleration_y
            playfield[runner.coords.y][runner.coords.x] = True

            if runner.in_default_position(dimensions):
                runner.velocity.y = 0

            last_tick = time.time()
        for row in playfield:
            for cell in row:
                sys.stdout.write('\xff\xff\xff' if cell else '\x00\x00\x00')
        sys.stdout.flush()
    elif line[0] == 'P':
        if line[2:5] == 'FB1':
            runner.velocity.y = -5
