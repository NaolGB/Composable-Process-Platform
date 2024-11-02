from config.config import config

class Mean:
    def __init__(self, *args, **kwargs):
        """
        :param args: A list of numbers to calculate the mean.
        """
        self.config = config
        self.inputs = {
            "args": args,
            "kwargs": kwargs,
        }
        self.outputs = {
            "args": [],
            "kwargs": {},
        }
    def setup(self):
        # validate inputs
        assert len(self.inputs['args']) > 0, "At least one argument is required."
        assert all(isinstance(arg, (int, float)) for arg in self.inputs['args']), "All arguments must be integers or floats."

        # sanitize inputs
        # --- no sanitization needed for this module ---

    def execute(self):
        # calculate mean
        mean = sum(self.inputs['args']) / len(self.inputs['args'])
        self.outputs['args'] = [mean]

    def cleanup(self):
        # --- no cleanup needed for this module ---
        pass

    def run(self):
        self.setup()
        self.execute()
        self.cleanup()
        return self.outputs