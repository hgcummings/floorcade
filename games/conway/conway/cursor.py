class Cursor:
    def __init__(self, dimensions):
        self._dimensions = dimensions
        self.x = dimensions.width / 2
        self.y = dimensions.height / 2

    def left(self):
        self.x = max(0, self.x - 1)

    def right(self):
        self.x = min(self._dimensions.width - 1, self.x + 1)

    def down(self):
        self.y = max(0, self.y - 1)

    def up(self):
        self.y = min(self._dimensions.height - 1, self.y + 1)
