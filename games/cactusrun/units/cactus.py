from point import Point
from units.unit import Unit


class Cactus(Unit):

    def move(self):
        Unit.move(self)
        if self.coords.x < 5:
            self.coords.x = 55
            self.accelerate(Point(-1, 0))
