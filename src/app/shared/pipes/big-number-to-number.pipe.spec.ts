import { BigNumberToNumberPipe } from './big-number-to-number.pipe';

describe('BigNumberToNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new BigNumberToNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
