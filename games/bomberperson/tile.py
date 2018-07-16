class Tile:

    def __init__(self, passable, color, breakable=False):
        self.passable = passable
        self.color = color
        self.player = None

    def draw(self):
        if(self.player == None):
            return self.color.toBytes()
        return self.player.draw()

    def setPlayer(self, player):
        self.player = player
