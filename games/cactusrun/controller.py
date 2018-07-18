import sys
import time

from playfield import Playfield


class Controller:

    def __init__(self):
        self.last_tick = time.time()
        self.playfield = Playfield()
        self.playfield.init()
        pass

    @staticmethod
    def ready():
        sys.stdout.write('READY\n')
        sys.stdout.flush()

    def run_game_cycle(self):
        line = sys.stdin.readline()
        if line.strip() == 'SKILL':
            exit()
        elif line.strip() == 'STICK':
            if time.time() - self.last_tick > 0.1:
                self.playfield.run_playfield_cycle()
                self.last_tick = time.time()
            for row in self.playfield.generate(self.playfield.world.runner, self.playfield.world.cactus):
                for cell in row:
                    sys.stdout.write('\xff\xff\xff' if cell else '\x00\x00\x00')
            sys.stdout.flush()
        elif line[0] == 'P':
            if line[4:5] == '1':
                if self.playfield.world.runner.in_default_position(self.playfield.dimensions):
                    self.playfield.world.runner.jump()
