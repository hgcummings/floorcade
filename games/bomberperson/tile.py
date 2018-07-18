from color import Color

class Tile:

    def __init__(self, passable, color, breakable=False):
        self.passable = passable
        self.color = color
        self.player = None
        self.bomb = None
        self.exploding = 0
        self.breakable = breakable

    def tick(self, playfield):
        if(self.bomb != None):
            self.bomb.tick(playfield)
        if(self.exploding > 0):
            if self.breakable:
                self.passable = True
                self.color = Color(0,255,0)
            self.exploding -= 1

    def isPassable(self):
        return self.passable and self.bomb == None

    def draw(self):
        if(self.exploding > 0):
            return Color(255,0,0).toBytes()
        if(self.player != None):
            return self.player.draw()
        if(self.bomb != None):
            return self.bomb.draw()
        return self.color.toBytes()


    def setPlayer(self, player):
        self.player = player
