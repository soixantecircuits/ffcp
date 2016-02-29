import ffcp from '../../src/ffcp';

describe('ffcp', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(ffcp, 'greet');
      ffcp.greet();
    });

    it('should have been run once', () => {
      expect(ffcp.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(ffcp.greet).to.have.always.returned('hello');
    });
  });
});
