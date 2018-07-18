import sys

from playfield import Playfield


class Controller:

    def __init__(self):
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
            self.playfield.run_playfield_cycle()
            self.print_pixel_map(self.playfield.generate_pixel_map())
        elif line[0] == 'P':
            self.on_user_input(line[1:5])

    def on_user_input(self, user_input):
        if user_input[3:4] == '1':
            if self.playfield.world.runner.in_default_position(self.playfield.dimensions):
                self.playfield.world.runner.jump()

    @staticmethod
    def print_pixel_map(pixel_map):
        for row in pixel_map:
            for pixel in row:
                sys.stdout.write(pixel.to_string())
        sys.stdout.flush()
