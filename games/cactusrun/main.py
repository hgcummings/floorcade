import argparse
import math
import sys
import time

from cactus import Cactus
from playfield import Playfield
from runner import Runner
from point import Point

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

dimensions = parser.parse_args()

playfield = Playfield(dimensions)
runner = Runner(Point(10, dimensions.height / 2))
cactus = Cactus(Point(dimensions.width - 1, dimensions.height / 2))

acceleration_x, acceleration_y = 0, 1

sys.stdout.write('READY\n')
sys.stdout.flush()

last_tick = time.time()
while True:
    line = sys.stdin.readline()
    if line.strip() == 'SKILL':
        exit()
    elif line.strip() == 'STICK':
        if time.time() - last_tick > 0.1:

            if math.fabs(runner.coords.x - cactus.coords.x) < cactus.size.x and math.fabs(runner.coords.y - cactus.coords.y) < cactus.size.y:
                continue

            runner.move()
            runner.accelerate(acceleration_y)

            cactus.move(playfield.dimensions)

            playfield.reset()

            if runner.in_default_position(playfield.dimensions):
                runner.velocity.y = 0

            last_tick = time.time()
        for row in playfield.generate(runner, cactus):
            for cell in row:
                sys.stdout.write('\xff\xff\xff' if cell else '\x00\x00\x00')
        sys.stdout.flush()
    elif line[0] == 'P':
        if line[2:5] == 'FB1':
            if runner.in_default_position(dimensions):
                runner.jump()
