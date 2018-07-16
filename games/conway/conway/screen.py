import sys

import math


class Screen:
    def __init__(self, dimensions):
        self._screen = [[['\x00', '\x00', '\x00'] for i in range(dimensions.width)] for j in range(dimensions.height)]

    def render(self, universe, cursor):
        self._screen = [[age_to_colour(cell) for cell in row] for row in universe.render()]
        self._screen[cursor.y][cursor.x][0] = '\xff'

        rendered = "".join("".join("".join(cell) for cell in row) for row in self._screen)
        sys.stdout.write(rendered)
        sys.stdout.flush()


def age_to_colour(age):
    if age == 0:
        return ['\x00', '\x00', '\x00']
    else:
        unitary = math.pow(1.8, float(- age + 1) / 10)
        green = int(math.floor(unitary * 0xff))
        blue = int(math.floor((1 - unitary) * 0xff))
        return ['\x00', chr(green), chr(blue)]
