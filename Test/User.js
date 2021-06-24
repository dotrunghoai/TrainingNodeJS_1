const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../App')

const should = chai.should()

chai.use(chaiHttp)

describe('User', () => {

    describe('/POST User', () => {
        it('It should add a User', (done) => {
            const user = {
                id: '00012',
                firstname: 'nguyen van',
                lastname: 'khanh',
                email: 'nguyenvankhanh@rgmail.com',
                password: '@Password123456',
                age: 19
            }
            chai.request(server)
                .post('/user/add')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('Object')
                    res.body.should.have.property('id')
                    res.body.should.have.property('firstname')
                    res.body.should.have.property('lastname')
                    res.body.should.have.property('email')
                    res.body.should.have.property('age')
                    done()
                })
        });

        it('It should not add a User when id already exist', (done) => {
            const user = {
                id: '00012',
                firstname: 'nguyen van',
                lastname: 'khanh',
                email: 'nguyenvankhanh@rgmail.com',
                password: '@Password123456',
                age: 19
            }
            chai.request(server)
                .post('/user/add')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('message').eql('User already exist!')
                    done()
                })
        });

        it('It should not add a User without id field', (done) => {
            const user = {
                firstname: 'nguyen van',
                lastname: 'khanh',
                email: 'nguyenvankhanh@rgmail.com',
                password: '@Password123456',
                age: 19
            }
            chai.request(server)
                .post('/user/add')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.have.property('message').eql('ID is required!')
                    done()
                })
        });
    });

    describe('Login, check token, to do action', () => {
        let token = ""
        beforeEach((done) => {
            chai.request(server)
                .post('/signin')
                .send({
                    id: '00012',
                    password: '@Password123456'
                })
                .end((err, res) => {
                    token = res.text
                    done()
                })
        });

        describe('/GET all Users', () => {
            it('It should get all users', (done) => {
                chai.request(server)
                    .get('/user')
                    .set({ Authorization: `Bearer ${token}` })
                    .end((errD, resD) => {
                        resD.should.have.status(200)
                        resD.body.should.be.a('Array')
                        done()
                    })
            });
        })

        describe('/GET a User', () => {
            it('It should get a User', (done) => {
                chai.request(server)
                    .get('/user/00012')
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.should.be.a('Object')
                        res.body.should.have.property('id')
                        res.body.should.have.property('firstname')
                        res.body.should.have.property('lastname')
                        res.body.should.have.property('email')
                        res.body.should.have.property('age')
                        done()
                    })
            });
        });

        describe('/PUT a User', () => {
            it('It should update a User', (done) => {
                const user = {
                    firstname: 'Nguyễn Hữu',
                    lastname: 'Tài',
                    email: 'nguyenhuutai@yahoo.com',
                    password: '@Password123456',
                    age: 22
                }
                chai.request(server)
                    .put('/user/00012')
                    .set({ Authorization: `Bearer ${token}` })
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(202)
                        res.should.be.a('Object')
                        res.body.should.have.property('id')
                        res.body.should.have.property('firstname')
                        res.body.should.have.property('lastname')
                        res.body.should.have.property('email')
                        res.body.should.have.property('age')
                        done()
                    })
            });

            it('It should not update a User with id does not exist', (done) => {
                const user = {
                    firstname: 'Trịnh Mai',
                    lastname: 'An',
                    email: 'trinhmaian99@gmail.com',
                    password: 'ashkjfdhFHAS123@!',
                    age: 22
                }
                chai.request(server)
                    .put('/user/00015')
                    .set({ Authorization: `Bearer ${token}` })
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(404)
                        res.body.should.have.property('message').eql('Invalid User!')
                        done()
                    })
            });

            it('It should not update a User without email field', (done) => {
                const user = {
                    firstname: 'Nguyễn Điềm',
                    lastname: 'Việt',
                    password: 'LoanTheAnhHung123@',
                    age: 20
                }
                chai.request(server)
                    .put('/user/00012')
                    .set({ Authorization: `Bearer ${token}` })
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.have.property('message').eql('Email is required!')
                        done()
                    })
            });
        });

        describe('/DELETE a User', () => {
            it('It should not delete a User with id does not exist', (done) => {
                chai.request(server)
                    .delete('/user/00015')
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.have.status(404)
                        res.body.should.have.property('message').eql('Invalid User!')
                        done()
                    })
            });

            it('It should delete a User', (done) => {
                chai.request(server)
                    .delete('/user/00012')
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.have.status(202)
                        res.body.should.have.property('message').eql('Delete User Successfully!')
                        done()
                    })
            });
        });

    });
});