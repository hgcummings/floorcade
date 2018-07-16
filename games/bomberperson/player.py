from bomb import Bomb

class Player:

    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.cooldown = 0
        self.color = color
        self.intent = None
        self.alive = True

    def tick(self, playfield):
        if not self.alive:
            return
        if(self.cooldown > 0):
            self.cooldown -= 1

        current_tile = playfield[self.y][self.x]

        if current_tile.exploding > 0:
            self.alive = False
            current_tile.setPlayer(None)
            return

        old_pos = [self.x, self.y]
        if(self.intent == 'U'):
            self.y -= 1
        elif(self.intent == 'D'):
            self.y += 1
        elif(self.intent == 'L'):
            self.x -= 1
        elif(self.intent == 'R'):
            self.x += 1
        elif(self.intent == 'B' and self.cooldown == 0):
            if current_tile.bomb == None:
                current_tile.bomb = Bomb(self.x, self.y, playfield)
                cooldown = 50
        new_tile = playfield[self.y][self.x]
        if new_tile.isPassable():
            playfield[old_pos[1]][old_pos[0]].setPlayer(None)
            new_tile.setPlayer(self)
        else:
            self.x =  old_pos[0]
            self.y = old_pos[1]

    def draw(self):
        return self.color.toBytes()
