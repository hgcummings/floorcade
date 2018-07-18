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
