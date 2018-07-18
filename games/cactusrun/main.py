from controller import Controller
from playfield import Playfield
from point import Point
from units.cactus import Cactus
from units.runner import Runner

controller = Controller()
controller.ready()

while True:
    controller.run_game_cycle()
