import time


class Timer:

    def __init__(self):
        self.last_tick = time.time()

    def elapsed_time_since_last_check(self):
        elapsed_time = time.time() - self.last_tick
        self.last_tick = time.time()
        return elapsed_time
