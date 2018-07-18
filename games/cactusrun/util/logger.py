import sys


class Logger:

    @staticmethod
    def print_debug_coords(coords):
        sys.stderr.write(coords.x + ", " + coords.y)