import math
import sys
import time

from playfield import Playfield
from point import Point
from units.cactus import Cactus
from units.runner import Runner


class Controller:

    def __init__(self):
        self.last_tick = time.time()

        self.playfield = Playfield()
        self.playfield.init()

        self.runner = Runner(Point(10, self.playfield.dimensions.height / 2), Point(3, 4))
        self.cactus = Cactus(Point(self.playfield.dimensions.width - 1, self.playfield.dimensions.height / 2),
                             Point(3, 4))
        self.cactus.accelerate(Point(-2, 0))
        pass

    @staticmethod
    def ready():
        sys.stdout.write('READY\n')
        sys.stdout.flush()

    def run_game_cycle(self):
        line = sys.stdin.readline()
        if line.strip() == 'SKILL':
            exit()
        elif line.strip() == 'STICK':
            if time.time() - self.last_tick > 0.1:

                if math.fabs(self.runner.coords.x - self.cactus.coords.x) < self.cactus.size.x and math.fabs(
                        self.runner.coords.y - self.cactus.coords.y) < self.cactus.size.y:
                    return

                self.runner.move()
                self.runner.accelerate(Point(0, 1))

                self.cactus.move()

                self.playfield.reset()

                if self.runner.in_default_position(self.playfield.dimensions):
                    self.runner.velocity.y = 0

                self.last_tick = time.time()
            for row in self.playfield.generate(self.runner, self.cactus):
                for cell in row:
                    sys.stdout.write('\xff\xff\xff' if cell else '\x00\x00\x00')
            sys.stdout.flush()
        elif line[0] == 'P':
            if line[4:5] == '1':
                if self.runner.in_default_position(self.playfield.dimensions):
                    self.runner.jump()
