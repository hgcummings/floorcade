class Point:

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def get_int_coords(self):
        return Point(int(round(self.x)), int(round(self.y)))
