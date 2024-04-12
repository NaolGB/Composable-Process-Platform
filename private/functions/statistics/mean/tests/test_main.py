import pytest
from src.main import Mean

def test_mean_basic():
    mean = Mean(1, 2, 3, 4, 5).run()
    assert mean['args'][0] == 3.0, "Expected mean of 3.0"
    assert len(mean['args']) == 1, "Expected only one output"

def test_mean_floats():
    mean = Mean(1.0, 2.0, 3.0, 4.0, 5.0).run()
    assert mean['args'][0] == 3.0, "Expected mean of 3.0"

def test_mean_mixed():
    mean = Mean(1, 2.5, 3, 4.5, 5).run()
    assert mean['args'][0] == 3.2, "Expected mean of 3.2"

def test_mean_single_value():
    mean = Mean(100).run()
    assert mean['args'][0] == 100.0, "Expected mean of 100.0"

def test_mean_no_input():
    with pytest.raises(AssertionError, match="At least one argument is required."):
        Mean().run()

def test_mean_invalid_input_type():
    with pytest.raises(AssertionError, match="All arguments must be integers or floats."):
        Mean("one", "two", "three").run()

def test_mean_partially_invalid_input():
    with pytest.raises(AssertionError, match="All arguments must be integers or floats."):
        Mean(1, 2, "three", 4).run()
