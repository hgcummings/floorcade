import argparse

from util import pixel
from util.timer import Timer
from world.world import World


class Playfield:

    def __init__(self):
        self.dimensions = None
        self.world = None
        self.timer = Timer()
        self.map = []

    def init(self):
        parser = argparse.ArgumentParser()
        parser.add_argument('--width', type=int)
        parser.add_argument('--height', type=int)
        self.dimensions = parser.parse_args()

        self.clear_pixel_map()

        self.world = World(self.dimensions)
        self.world.create_world()

    def run_playfield_cycle(self):
        elapsed_time = self.timer.elapsed_time_since_last_check()
        self.world.run_world_cycle(elapsed_time)

    def generate_pixel_map(self):

        if self.world.game_has_ended:
            return self.map

        self.clear_pixel_map()

        current_map = self.map
        units = self.world.get_units()

        for unit in units:
            self.draw_unit_on_map(unit, current_map)

        return current_map

    @staticmethod
    def draw_unit_on_map(unit, current_map):
        unit_pixels = unit.get_pixels()
        unit_coords = unit.coords.get_int_coords()
        for row in range(0, unit.size.y):
            for col in range(0, unit.size.x):
                if unit_pixels[row][col]:
                    current_map[unit_coords.y - row][unit_coords.x + col] = unit_pixels[row][col]

    def clear_pixel_map(self):
        self.map = [[pixel.black for i in range(self.dimensions.width)] for j in range(self.dimensions.height)]
