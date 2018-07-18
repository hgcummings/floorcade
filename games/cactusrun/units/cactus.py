from util.point import Point
from units.unit import Unit


class Cactus(Unit):

    def move(self, elapsed_time):
        Unit.move(self, elapsed_time)
        if self.coords.x < 5:
            self.coords.x = 55
            self.accelerate(Point(-1, 0), 1)
