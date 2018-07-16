def rule(cell, live_neighbours):
    if cell:
        return 2 <= live_neighbours <= 3
    else:
        return live_neighbours == 3


class Universe:
    """The universe is an n by n grid of integers where 0 is dead and i > 0 is age."""

    def __init__(self, dimensions):
        self._dimensions = dimensions
        self._patterns = Patterns(dimensions)
        self._universe = self._patterns.pulsar()

    def update(self):
        """Behaviour around the edges of the screen is not great"""

        new_universe = self._patterns.empty()
        for j, row in enumerate(self._universe):
            for i, cell in enumerate(row):
                live_neighbours = 0
                for y in range(max(0, j - 1), min(j + 1, self._dimensions.height - 1) + 1):
                    for x in range(max(0, i - 1), min(i + 1, self._dimensions.width - 1) + 1):
                        if y == j and x == i:
                            continue
                        if self._universe[y][x]:
                            live_neighbours += 1

                if rule(cell, live_neighbours):
                    new_universe[j][i] = self._universe[j][i] + 1
                else:
                    new_universe[j][i] = 0

                # sys.stderr.write("{}{}{} ".format(cell, live_neighbours, alive))
            # sys.stderr.write("\n")

        self._universe = new_universe

    def flip(self, cursor):
        self._universe[cursor.y][cursor.x] = not self._universe[cursor.y][cursor.x]

    def render(self):
        """Render as an NxN grid of ages"""
        return self._universe

    def overwrite_with_pattern(self, name):
        self._universe = getattr(self._patterns, name)()


class Patterns:
    def __init__(self, dimensions):
        self._dimensions = dimensions

    def empty(self):
        return [[0 for i in range(self._dimensions.width)] for j in range(self._dimensions.height)]

    def beacon(self):
        """https://en.wikipedia.org/wiki/Conway's_Game_of_Life"""
        return self._build_universe([[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]])

    def pulsar(self):
        """http://conwaylife.com/w/index.php?title=Pulsar"""
        return self._build_universe([
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
        ])

    def horizontal_line(self):
        return [[(j == self._dimensions.height / 2) for i in range(self._dimensions.width)] for j in
                range(self._dimensions.height)]

    def _build_universe(self, pattern):
        universe = self.empty()
        y = self._dimensions.height / 2 - (len(pattern) / 2)
        x = self._dimensions.width / 2 - (len(pattern[0]) / 2)
        for (j, row) in enumerate(pattern):
            for (i, cell) in enumerate(row):
                universe[j + y][i + x] = (cell == 1)
        return universe
