import math
import time

from point import Point
from units.cactus import Cactus
from units.runner import Runner


class World:

    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.runner = None
        self.cactus = None
        pass

    def create_world(self):
        self.runner = Runner(Point(10, self.dimensions.height / 2), Point(3, 4))
        self.cactus = Cactus(Point(self.dimensions.width - 1, self.dimensions.height / 2), Point(3, 4))
        self.cactus.accelerate(Point(-2, 0))

    def run_world_cycle(self):
        if math.fabs(self.runner.coords.x - self.cactus.coords.x) < self.cactus.size.x and math.fabs(
                self.runner.coords.y - self.cactus.coords.y) < self.cactus.size.y:
            return

        self.runner.move()
        self.runner.accelerate(Point(0, 1))

        self.cactus.move()

        if self.runner.in_default_position(self.dimensions):
            self.runner.velocity.y = 0
