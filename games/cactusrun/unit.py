from point import Point


class unit:

    def __init__(self, coords, size):
        self.coords = coords
        self.size = size

    def get_drawing_coords(self):
        drawing_coords = []

        for x in range(0, self.size.x):
            for y in range(0, self.size.y):
                drawing_coords.append(Point(self.coords.x + x, self.coords.y + y))
