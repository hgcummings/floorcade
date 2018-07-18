from controller import Controller
from playfield import Playfield
from point import Point
from units.cactus import Cactus
from units.runner import Runner

playfield = Playfield()
playfield.init()

runner = Runner(Point(10, playfield.dimensions.height / 2), Point(3,4))
cactus = Cactus(Point(playfield.dimensions.width - 1, playfield.dimensions.height / 2), Point(3,4))
cactus.accelerate(Point(-2,0))

acceleration_x, acceleration_y = 0, 1

controller = Controller(playfield, runner, cactus)
controller.ready()

while True:
    controller.run_game_cycle()
