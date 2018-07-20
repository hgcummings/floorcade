class Point:

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def get_int_coords(self):
        return Point(int(round(self.x)), int(round(self.y)))

    def is_inside(self, rectangle):
        self_coords = self.get_int_coords()
        left_bottom_coord = rectangle[0][0].get_int_coords()
        right_top_coord = rectangle[1][1].get_int_coords()
        return left_bottom_coord.x <= self_coords.x < right_top_coord.x and \
               left_bottom_coord.y <= self_coords.y < right_top_coord.y
