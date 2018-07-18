import math
import sys

import settings
from units.cactus import Cactus
from units.runner import Runner
from util.point import Point


class World:

    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.runner = None
        self.cactus = None
        pass

    def create_world(self):
        self.runner = Runner(Point(10, self.dimensions.height / 2), Point(3, 4))
        self.cactus = Cactus(Point(self.dimensions.width - 1, self.dimensions.height / 2), Point(3, 4))
        self.cactus.accelerate(Point(-20, 0), 1)

    def run_world_cycle(self, elapsed_time):
        if math.fabs(self.runner.coords.x - self.cactus.coords.x) < self.cactus.size.x and math.fabs(
                self.runner.coords.y - self.cactus.coords.y) < self.cactus.size.y:
            return

        self.runner.move(elapsed_time, settings.gravity)
        self.runner.accelerate(settings.gravity, elapsed_time)

        self.cactus.move(elapsed_time)

        if self.runner.in_default_position(self.dimensions):
            self.runner.velocity.y = 0
            self.runner.coords.y = self.dimensions.height / 2
