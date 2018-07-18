from util.pixel import Pixel
from util.point import Point


class Unit:

    def __init__(self, coords, size):
        self.coords = coords
        self.size = size
        self.velocity = Point(0, 0)

    def get_drawing_coords(self):
        drawing_coords = []

        for x in range(0, self.size.x):
            for y in range(0, self.size.y):
                drawing_coords.append(Point(self.coords.x + x, self.coords.y + y))

    def move(self, elapsed_time, acceleration=Point(0, 0)):
        self.coords.x += self.velocity.x * elapsed_time + 0.5 * acceleration.x * elapsed_time * elapsed_time
        self.coords.y += self.velocity.y * elapsed_time + 0.5 * acceleration.y * elapsed_time * elapsed_time

    def accelerate(self, acceleration, elapsed_time):
        self.velocity.x += acceleration.x * elapsed_time
        self.velocity.y += acceleration.y * elapsed_time

    def get_pixels(self):
        pixels = []
        for row in range(0, self.size.y):
            pixel_row = []
            for column in range(0, self.size.x):
                pixel_row.append(Pixel.white())
            pixels.append(pixel_row)
        return pixels
