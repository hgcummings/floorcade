import settings
from util import pixel
from util.point import Point
from units.unit import Unit


class Runner(Unit):

    def in_default_position(self, dimensions):
        return self.coords.y >= dimensions.height / 2

    def jump(self):
        self.accelerate(Point(0, settings.jump_height * -1), 1)

    def get_pixels(self):
        bare = False
        fill = pixel.cyan
        pixel_map = [
            [bare, fill, bare],
            [fill, fill, fill],
            [bare, fill, bare],
            [fill, bare, fill],
        ]
        pixel_map.reverse()
        return pixel_map
