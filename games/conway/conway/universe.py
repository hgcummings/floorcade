def rule(cell, live_neighbours):
    if cell:
        return 2 <= live_neighbours <= 3
    else:
        return live_neighbours == 3


class Universe:
    def __init__(self, dimensions):
        self._dimensions = dimensions
        self._patterns = Patterns(dimensions)
        self._universe = self._patterns.beacon()

    def update(self):
        """Behaviour around the edges of the screen is not great"""

        new_universe = [[False for i in range(self._dimensions.width)] for j in range(self._dimensions.height)]
        for j, row in enumerate(self._universe):
            for i, cell in enumerate(row):
                live_neighbours = 0
                for y in range(max(0, j - 1), min(j + 1, self._dimensions.height - 1) + 1):
                    for x in range(max(0, i - 1), min(i + 1, self._dimensions.width - 1) + 1):
                        if y == j and x == i:
                            continue
                        if self._universe[y][x]:
                            live_neighbours += 1

                alive = rule(cell, live_neighbours)
                new_universe[j][i] = alive

                # sys.stderr.write("{}{}{} ".format(cell, live_neighbours, alive))
            # sys.stderr.write("\n")

        self._universe = new_universe

    def flip(self, cursor):
        self._universe[cursor.y][cursor.x] = not self._universe[cursor.y][cursor.x]

    def render(self):
        return self._universe

    def overwrite_with_pattern(self, name):
        self._universe = getattr(self._patterns, name)()


class Patterns:
    def __init__(self, dimensions):
        self._dimensions = dimensions

    def empty(self):
        return [[False for i in range(self._dimensions.width)] for j in range(self._dimensions.height)]

    def beacon(self):
        universe = self.empty()

        # Create a beacon - https://en.wikipedia.org/wiki/Conway's_Game_of_Life
        pattern = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]]

        y = self._dimensions.height / 2 - 2
        x = self._dimensions.width / 2 - 2

        for (j, row) in enumerate(pattern):
            for (i, cell) in enumerate(row):
                universe[j + y][i + x] = (cell == 1)

        return universe

    def horizontal_line(self):
        return [[(j == self._dimensions.height / 2) for i in range(self._dimensions.width)] for j in range(self._dimensions.height)]
