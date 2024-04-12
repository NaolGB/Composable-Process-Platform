config = {
    "name": "Mean",
    "version": "1.0.0",
    "base_class_version": "0.0.1",
    "description": "This funciton calculates the mean of the input values",
    "maximum_retries": 5,
    "inputs": {
      "args": {
            "required": True,
            "type": "list(string|number)"
        },
        "kwargs": {
            "required": False,
            "type": "dict(string|number)"
        }
    },
    "outputs": {
        "args": {
            "required": True,
            "type": "number"
        },
        "kwargs": {
            "required": False,
            "type": "number"
        }
    }
}