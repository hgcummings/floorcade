from controller import Controller

controller = Controller()
controller.ready()

while True:
    controller.run_game_cycle()
