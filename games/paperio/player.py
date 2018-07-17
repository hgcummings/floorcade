class Player:
    def __init__(self, x, y, direction):
        self.x = x
        self.y = y
        self.dx, self.dy = direction
        self.trail_start_set = False

    def update(self):
        self.x += self.dx
        self.y += self.dy

    def setDirection(self, dx, dy):
    	self.dx = dx
    	self.dy = dy

    def set_trail_start(self, x, y):
    	self.trail_start_set = True
    	self.trail_start = x, y

    def clear_trail_start(self):
    	self.trail_start_set = False

    def get_trail_start(self):
    	if self.trail_start_set:
    		return self.trail_start
    	raise ValueError("The trail start is not initialised")