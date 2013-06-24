var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function ListStub () {
    return {
        dev: ''
    };
}

describe('ListController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /lists/new
     * Should render lists/new.ejs
     */
    it('should render "new" template on GET /lists/new', function (done) {
        request(app)
        .get('/lists/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/lists\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /lists
     * Should render lists/index.ejs
     */
    it('should render "index" template on GET /lists', function (done) {
        request(app)
        .get('/lists')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/lists\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /lists/:id/edit
     * Should access List#find and render lists/edit.ejs
     */
    it('should access List#find and render "edit" template on GET /lists/:id/edit', function (done) {
        var List = app.models.List;

        // Mock List#find
        List.find = sinon.spy(function (id, callback) {
            callback(null, new List);
        });

        request(app)
        .get('/lists/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            List.find.calledWith('42').should.be.true;
            app.didRender(/lists\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /lists/:id
     * Should render lists/index.ejs
     */
    it('should access List#find and render "show" template on GET /lists/:id', function (done) {
        var List = app.models.List;

        // Mock List#find
        List.find = sinon.spy(function (id, callback) {
            callback(null, new List);
        });

        request(app)
        .get('/lists/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            List.find.calledWith('42').should.be.true;
            app.didRender(/lists\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /lists
     * Should access List#create when List is valid
     */
    it('should access List#create on POST /lists with a valid List', function (done) {
        var List = app.models.List
        , list = new ListStub;

        // Mock List#create
        List.create = sinon.spy(function (data, callback) {
            callback(null, list);
        });

        request(app)
        .post('/lists')
        .send({ "List": list })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            List.create.calledWith(list).should.be.true;

            done();
        });
    });

    /*
     * POST /lists
     * Should fail when List is invalid
     */
    it('should fail on POST /lists when List#create returns an error', function (done) {
        var List = app.models.List
        , list = new ListStub;

        // Mock List#create
        List.create = sinon.spy(function (data, callback) {
            callback(new Error, list);
        });

        request(app)
        .post('/lists')
        .send({ "List": list })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            List.create.calledWith(list).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /lists/:id
     * Should redirect back to /lists when List is valid
     */
    it('should redirect on PUT /lists/:id with a valid List', function (done) {
        var List = app.models.List
        , list = new ListStub;

        List.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/lists/1')
        .send({ "List": list })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/lists/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /lists/:id
     * Should not redirect when List is invalid
     */
    it('should fail / not redirect on PUT /lists/:id with an invalid List', function (done) {
        var List = app.models.List
        , list = new ListStub;

        List.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/lists/1')
        .send({ "List": list })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /lists/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a List on DELETE /lists/:id');

    /*
     * DELETE /lists/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a List on DELETE /lists/:id if it fails');
});
