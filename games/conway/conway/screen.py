import sys


class Screen:
    def __init__(self, dimensions):
        self._screen = [[['\x00', '\x00', '\x00'] for i in range(dimensions.width)] for j in range(dimensions.height)]

    def render(self, universe, cursor):
        self._screen = [[['\x00', '\xff', '\x00'] if cell else ['\x00', '\x00', '\x00'] for cell in row] for row in
                        universe.render()]
        self._screen[cursor.y][cursor.x][0] = '\xff'

        rendered = "".join("".join("".join(cell) for cell in row) for row in self._screen)
        sys.stdout.write(rendered)
        sys.stdout.flush()
