import argparse

from world.world import World


class Playfield:

    def __init__(self):
        self.dimensions = None
        self.world = None
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
        self.world.run_world_cycle()
        self.reset()

    def reset(self):
        self.map = [
            [False if (j != self.dimensions.height / 2 + 1) else True for i in range(self.dimensions.width)] for j in
            range(self.dimensions.height)]

    def generate_pixel_map(self):
        current_map = self.map
        runner = self.world.runner
        cactus = self.world.cactus
        current_map[runner.coords.y][runner.coords.x] = True
        current_map[cactus.coords.y][cactus.coords.x] = True
        current_map[cactus.coords.y - 1][cactus.coords.x] = True
        current_map[cactus.coords.y - 2][cactus.coords.x] = True
        current_map[cactus.coords.y - 3][cactus.coords.x] = True
        return current_map
