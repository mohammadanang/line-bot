const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../index');
const localServer = supertest(server);

describe('TESTING', () => {
    it('should return string', (done) => {
        localServer
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});