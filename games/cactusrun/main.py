import math
import sys
import time

from units.cactus import Cactus
from playfield import Playfield
from point import Point
from units.runner import Runner

playfield = Playfield()
playfield.init()

runner = Runner(Point(10, playfield.dimensions.height / 2))
cactus = Cactus(Point(playfield.dimensions.width - 1, playfield.dimensions.height / 2))

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

            if math.fabs(runner.coords.x - cactus.coords.x) < cactus.size.x and math.fabs(
                    runner.coords.y - cactus.coords.y) < cactus.size.y:
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
        if line[4:5] == '1':
            if runner.in_default_position(playfield.dimensions):
                runner.jump()
