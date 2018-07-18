class Pixel:

    def __init__(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b

    def to_string(self):
        return chr(self.r) + chr(self.g) + chr(self.b)


white = Pixel(255, 255, 255)
black = Pixel(0, 0, 0)
