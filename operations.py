import process_engine as PE
import process_object as PO
import helpers

class OPCompare:
    def __init__(self, left_val, right_val) -> None:
        self.left = left_val
        self.right = right_val

        if type(self.left) != type(self.right):
            raise helpers.OPTypesMismatch(f"Type of left ({type(self.left)}) does not match type of right ({type(self.right)})")
    
    def compare_left_gt_right(self):
        # TODO assert left and right are both not collections
        return self.left > self.right