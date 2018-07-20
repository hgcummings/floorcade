import math
import random

import settings
from units.cactus import Cactus
from units.runner import Runner
from util.point import Point


class World:

    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.runner = None
        self.cactus = None
        self.ground = None
        self.game_has_ended = False
        pass

    def create_world(self):
        self.runner = Runner(Point(10, self.dimensions.height / 2), Point(3, 4))
        self.cactus = Cactus(Point(self.dimensions.width - 5, self.dimensions.height / 2), Point(3, 4))
        self.cactus.accelerate(Point(-20, 0), 1)
        self.ground = Cactus(Point(0, self.dimensions.height / 2 + 2), Point(self.dimensions.width, 2))

    def run_world_cycle(self, elapsed_time):

        if self.runner.collide_with(self.cactus):
            self.game_has_ended = True
            return

        self.runner.move(elapsed_time, settings.gravity)
        self.runner.accelerate(settings.gravity, elapsed_time)

        self.cactus.move(elapsed_time)

        if self.runner.in_default_position(self.dimensions):
            self.runner.velocity.y = 0
            self.runner.coords.y = self.dimensions.height / 2

    def get_units(self):
        return [self.cactus, self.runner, self.ground]
