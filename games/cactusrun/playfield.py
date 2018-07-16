class Playfield:

    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.map = []
        self.reset()

    def reset(self):
        self.map = [
            [False if (j != self.dimensions.height / 2 + 1) else True for i in range(self.dimensions.width)] for j in
            range(self.dimensions.height)]

    def generate_with_runner(self, runner):
        current_map = self.map
        current_map[runner.coords.y][runner.coords.x] = True
        return current_map
