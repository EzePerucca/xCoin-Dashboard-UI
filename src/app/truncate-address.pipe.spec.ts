import { TruncateAddressPipe } from './truncate-address.pipe';

describe('TruncateAddressPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateAddressPipe();
    expect(pipe).toBeTruthy();
  });
});
