from util import pixel
from util.point import Point


class Unit:

    def __init__(self, coords, size):
        self.coords = coords
        self.size = size
        self.velocity = Point(0, 0)

    def get_drawing_coords(self):
        drawing_coords = []

        for x in range(self.size.x):
            for y in range(self.size.y):
                drawing_coords.append(Point(self.coords.x + x, self.coords.y + y))

    def move(self, elapsed_time, acceleration=Point(0, 0)):
        self.coords.x += self.velocity.x * elapsed_time + 0.5 * acceleration.x * elapsed_time * elapsed_time
        self.coords.y += self.velocity.y * elapsed_time + 0.5 * acceleration.y * elapsed_time * elapsed_time

    def accelerate(self, acceleration, elapsed_time):
        self.velocity.x += acceleration.x * elapsed_time
        self.velocity.y += acceleration.y * elapsed_time

    def get_pixels(self):
        pixels = []
        for row in range(self.size.y):
            pixel_row = []
            for col in range(self.size.x):
                pixel_row.append(pixel.white)
            pixels.append(pixel_row)
        return pixels

    def collide_with(self, collider):
        self_coords = self.get_edge_coords()
        collder_coords = collider.get_edge_coords()

        for row in self_coords:
            for coords in row:
                if coords.is_inside(collder_coords):
                    return True
        return False

    def get_edge_coords(self):
        return [
            [
                Point(self.coords.x, self.coords.y),
                Point(self.coords.x + self.size.x, self.coords.y),
            ],
            [
                Point(self.coords.x, self.coords.y + self.size.y),
                Point(self.coords.x + self.size.x, self.coords.y + self.size.y),
            ]
        ]
