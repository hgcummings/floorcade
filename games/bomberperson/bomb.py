from color import Color

class Bomb:



    def __init__(self, x, y, playfield):
        self.x = x
        self.y = y
        playfield[y][x].bomb = self
        self.exploding_time = 30
        self.countdown = self.exploding_time + 20

    def tick(self, playfield):
        self.countdown -= 1
        if(self.countdown == 0):
            playfield[self.y][self.x].bomb = None
            solid = False
            for i in reversed(range(self.y-2, self.y)):
                if i > 0 and i < len(playfield) and not solid:
                    tile = playfield[i][self.x]
                    solid = not tile.passable
                    tile.exploding = self.exploding_time
            solid = False
            for i in range(self.y, self.y+3):
                if i > 0 and i < len(playfield) and not solid:
                    tile = playfield[i][self.x]
                    solid = not tile.passable
                    tile.exploding = self.exploding_time
            solid = False
            for i in reversed(range(self.x - 2, self.x)):
                if i > 0 and i < len(playfield[0]) and not solid:
                    tile = playfield[self.y][i]
                    solid = not tile.passable
                    tile.exploding = self.exploding_time
            solid = False
            for i in range(self.x, self.x+3):
                if i > 0 and i < len(playfield[0]) and not solid:
                    tile = playfield[self.y][i]
                    solid = not tile.passable
                    tile.exploding = self.exploding_time

    def draw(self):
        if(self.countdown > 30):
            return Color(0,0,0).toBytes()
        elif(self.countdown > 10):
            return Color(255,0,0).toBytes()
        else:
            return Color(255,255,255).toBytes()
