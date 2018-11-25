let mongoose = require("mongoose");
let product = require("../api/models/product");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Products', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Book.remove({}, (err) => {
    //         done();
    //     });
    // });
    /*
     * Test the /GET route
     */
    describe('/GET product', () => {
        it('it should GET all the products', (done) => {
            chai.request(server)
                .get('/product')
                .end((err, res) => {
                    res.should.have.status(200);
                    //res.body.should.be.a('object');
                    //res.body.length.should.be.eql(4);
                    done();
                });
        });
    });

});