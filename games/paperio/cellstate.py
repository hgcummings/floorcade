from colours import *

class CellState:
    def getColour(self):
        pass


class Empty(CellState):
    def getColour(self):
        return "\x00\x00\x00"


class Trail(CellState):
    def __init__(self, player, replaced_cell):
        self.player = player
        self.replaced_cell = replaced_cell

    def getColour(self):
        return trail_colours[self.player]


class Owned(CellState):
    def __init__(self, player):
        self.player = player

    def getColour(self):
        return own_colours[self.player]

