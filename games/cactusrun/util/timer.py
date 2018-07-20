import time


class Timer:

    def __init__(self):
        self.last_tick = time.time()

    def elapsed_time(self):
        return time.time() - self.last_tick

    def set_last_tick_to_current_time(self):
        self.last_tick = time.time()

    def elapsed_time_since_last_check(self):
        elapsed_time = self.elapsed_time()
        self.set_last_tick_to_current_time()
        return elapsed_time
