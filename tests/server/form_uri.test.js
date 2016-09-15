import { getUriWithRefUrl, getUriWithCheck } from '../../modules/session/form_uri';
import { expect } from 'chai';

describe('Session Helper', function() {
  describe('#getUriWithCheck', () => {
      it('should return all configs', () => {
          var result = getUriWithCheck(true, 'http://localhost:8000/login');
          expect(result).to.be.equal('/');
      });
  });
});
