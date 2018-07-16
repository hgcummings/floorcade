from point import Point


class Cactus:

    def __init__(self, coords):
        self.coords = coords
        self.velocity = Point(-2, 0)
        self.size = Point(3, 4)

    def move(self, dimensions):
        self.coords.x += self.velocity.x
        if self.coords.x < 5:
            self.coords.x = dimensions.width - 1
            self.velocity.x -= 1
