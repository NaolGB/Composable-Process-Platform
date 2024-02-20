def transition():
    return 'ValidateSalesOrder'

if __name__ == '__main__':
    next_step = transition()
    print(next_step)