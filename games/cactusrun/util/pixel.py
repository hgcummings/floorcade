class Pixel:

    def __init__(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b

    def to_string(self):
        return chr(self.r) + chr(self.g) + chr(self.b)


white = Pixel(255, 255, 255)
black = Pixel(0, 0, 0)

red = Pixel(255, 0, 0)
green = Pixel(0, 255, 0)
blue = Pixel(0, 0, 255)
yellow = Pixel(255, 255, 0)
magenta = Pixel(255, 0, 255)
cyan = Pixel(0, 255, 255)
