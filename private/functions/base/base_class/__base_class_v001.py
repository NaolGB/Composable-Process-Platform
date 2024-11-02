from abc import ABC, ABCMeta, abstractmethod

class BaseFunctionality(ABC):
    def __init__(self, config):
        """
        :param config: A dictionary containing configuration parameters.
        """
        self.config = config
        self.inputs = {
            "args": [],
            "kwargs": {},
        }
        self.outputs = {
            "args": [],
            "kwargs": {},
        }

    @abstractmethod
    def setup(self):
        """
        - setup necessary configurations or initial states
        1. validate inputs
            * Type Checks: Ensuring the data is of the correct type (e.g., integers, strings).
            * Format Checks: Verifying data conforms to a specific format (e.g., email addresses, phone numbers).
            * Range Checks: Ensuring numbers or dates fall within a specific range.
            * List Checks: Verifying inputs are among a predefined list of allowable values.
        2. sanitize inputs
            * Escaping: Transforming special characters into a safe form that prevents them from being interpreted as executable code.
            * Stripping: Removing unnecessary or potentially harmful characters, such as script tags or SQL comments.
            * Normalizing: Converting input into a consistent format or data type (e.g., Unicode normalization).
        """
        pass

    @abstractmethod
    def execute(self):
        """
        Execute the functionality. This method should be implemented by all subclasses
        and contain the core logic of the module.

        :param args: Positional arguments for execution.
        :param kwargs: Keyword arguments for execution.
        """
        pass

    @abstractmethod
    def cleanup(self):
        """
        - cleanup resources
        - clear memory
        - close connections
        - close files
        - close database connections
        - close http connections
        - close sockets
        - close threads
        - close processes
        - logout of services/apis
        """
        pass

    @abstractmethod
    def run(self):
        """
        step by step execution of the functionality
            return: config.outputs type of return from config.json

        - The entry point that calls this method already handles and makes sure 
            - required inputs are passed
            - required outputs are returned
            - handles returns
        """
        self.setup()
        self.execute()
        self.cleanup()