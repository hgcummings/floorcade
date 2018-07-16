import argparse

from .game import Game

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int)
parser.add_argument('--height', type=int)

Game(parser.parse_args()).run()
