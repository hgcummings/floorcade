import settings
from util import pixel
from util.point import Point
from units.unit import Unit
from util.timer import Timer

bare = False
fill = pixel.magenta
open_legs_pixel_map = [
    [bare, fill, bare],
    [bare, fill, fill],
    [bare, fill, bare],
    [fill, bare, fill],
]
closed_legs_pixel_map = [
    [bare, fill, bare],
    [bare, fill, fill],
    [bare, fill, bare],
    [bare, fill, bare],
]


class Runner(Unit):

    def __init__(self, coords, size):
        Unit.__init__(self, coords, size)
        self.timer = Timer()
        self.legs_are_open = True

    def in_default_position(self, dimensions):
        return self.coords.y >= dimensions.height / 2

    def jump(self):
        self.accelerate(Point(0, settings.jump_height * -1), 1)

    def get_pixels(self):
        self.legs_are_open = self.get_legs_status()
        pixel_map = list(open_legs_pixel_map if self.legs_are_open else closed_legs_pixel_map)
        pixel_map.reverse()
        return pixel_map

    def get_legs_status(self):
        if self.velocity.y != 0:
            return True
        elif self.timer.elapsed_time() > 0.1:
            self.timer.set_last_tick_to_current_time()
            return not self.legs_are_open
        else:
            return self.legs_are_open
