from point import Point


class Runner:

    def __init__(self, coords):
        self.coords = coords
        self.velocity = Point(0, 0)
        self.size = Point(3, 4)

    def in_default_position(self, dimensions):
        return self.coords.y == dimensions.height / 2

    def jump(self):
        self.velocity.y = -3

    def move(self):
        self.coords.y += self.velocity.y

    def accelerate(self, acceleration_y):
        self.velocity.y += acceleration_y