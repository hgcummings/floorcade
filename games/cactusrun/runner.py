from point import Point


class Runner:

    def __init__(self, coords):
        self.coords = coords
        self.velocity = Point(0, 0)
        self.size = Point(3, 4)

    def in_default_position(self, dimensions):
        return self.coords.x == dimensions.width / 2 and \
               self.coords.y == dimensions.height / 2
