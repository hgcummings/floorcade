class Playfield:

    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.map = []
        self.reset()

    def reset(self):
        self.map = [
            [False if (j != self.dimensions.height / 2 + 1) else True for i in range(self.dimensions.width)] for j in
            range(self.dimensions.height)]

    def generate(self, runner, cactus):
        current_map = self.map
        current_map[runner.coords.y][runner.coords.x] = True
        current_map[cactus.coords.y][cactus.coords.x] = True
        current_map[cactus.coords.y - 1][cactus.coords.x] = True
        current_map[cactus.coords.y - 2][cactus.coords.x] = True
        current_map[cactus.coords.y - 3][cactus.coords.x] = True
        return current_map
