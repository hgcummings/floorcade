class Player:

    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color
        self.intent = None

    def tick(self, playfield):
        old_pos = [self.x, self.y]
        if(self.intent == 'U'):
            self.y -= 1
        elif(self.intent == 'D'):
            self.y += 1
        elif(self.intent == 'L'):
            self.x -= 1
        elif(self.intent == 'R'):
            self.x += 1
        new_tile = playfield[self.y][self.x]
        if new_tile.passable:
            playfield[old_pos[1]][old_pos[0]].setPlayer(None)
            new_tile.setPlayer(self)
        else:
            self.x =  old_pos[0]
            self.y = old_pos[1]

    def draw(self):
        return self.color.toBytes()
