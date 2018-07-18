from units.unit import Unit


class Ground(Unit):

    def __init__(self, coords, size):
        Unit.__init__(self, coords, size)
