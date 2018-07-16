import time
import sys

from .cursor import Cursor
from .screen import Screen
from .universe import Universe


class Game:
    def __init__(self, dimensions):
        self.dimensions = dimensions
        self.screen = Screen(dimensions)
        self.universe = Universe(dimensions)
        self.cursor = Cursor(dimensions)
        self.paused = False
        self.updates_per_second = 0.2
        self.last_tick = None

    def run(self):
        sys.stdout.write('READY\n')
        sys.stdout.flush()

        self.last_tick = time.time()
        while True:
            line = sys.stdin.readline()
            if line.strip() == 'SKILL':
                exit()
            elif line.strip() == 'STICK':
                self.tick()
            elif line[0] == 'P':
                self.user_input(line[2:5])

    def user_input(self, button):
        if button == 'DU1':
            self.cursor.up()
        elif button == 'DD1':
            self.cursor.down()
        elif button == 'DR1':
            self.cursor.right()
        elif button == 'DL1':
            self.cursor.left()
        elif button == 'FR1':
            self.universe.flip(self.cursor)
        elif button == 'FB1':
            self.paused = not self.paused
        elif button == 'FT1':
            self.updates_per_second *= 1.5
        elif button == 'FL1':
            self.updates_per_second /= 1.5
        elif button == 'RS1':
            self.universe.overwrite_with_pattern('horizontal_line')
        elif button == 'LS1':
            self.universe.overwrite_with_pattern('empty')

    def tick(self):
        if time.time() - self.last_tick > self.updates_per_second:
            if not self.paused:
                self.universe.update()
            self.last_tick = time.time()
        self.screen.render(self.universe, self.cursor)
