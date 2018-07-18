import argparse

from util.pixel import Pixel
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
        self.reset()

        self.world = World(self.dimensions)
        self.world.create_world()

    def run_playfield_cycle(self):
        elapsed_time = self.timer.elapsed_time_since_last_check()
        self.world.run_world_cycle(elapsed_time)
        self.reset()

    def reset(self):
        self.map = [
            [Pixel.black() if (j != self.dimensions.height / 2 + 1) else Pixel.white() for i in range(self.dimensions.width)] for j in
            range(self.dimensions.height)]

    def generate_pixel_map(self):
        current_map = self.map
        return current_map
