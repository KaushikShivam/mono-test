const request = require('supertest');

const User = require('../models/userModel');
const app = require('../app');

describe('Signup', () => {
  describe('successfully', () => {
    it('should create a new user with a 201 success code', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@email.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(201);
      const user = await User.findById(res.body.data.user._id);
      expect(user).not.toBeNull();

      expect(res.body.data.user).toMatchObject({
        name: 'test',
        email: 'test@email.com',
      });
      expect(user.password).not.toBe('password');
    });
  });

  describe('unsuccessfully', () => {
    it('should fail with invalid input data and 400 code', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send()
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(4);
    });

    it('should fail with no name', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'test@email.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Please provide your name');
    });
    it('should fail with no email', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Please provide your email');
    });
    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'shivam@',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Please provide a valid email');
    });

    it('should fail with duplicate email', async () => {
      await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(201);

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('This email already exists');
    });

    it('should fail with no password', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Please provide a password');
    });

    it('should fail with no confirmPassword', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          password: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Please confirm your password');
    });

    it('should fail with a password less than 8 characters', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          password: 'pass',
          confirmPassword: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain(
        'Password must be atleast 8 characters long'
      );
    });

    it('should fail when passwords do not match', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password1',
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors).toContain('Passwords do not match!');
    });
  });
});

describe('Login', () => {
  describe('successfully', () => {
    it('should login the user with 200 status', async () => {
      await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@email.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(201);
      await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@email.com',
          password: 'password',
        })
        .expect(200);
    });
  });

  describe('unsuccessfully', () => {
    it('should fail when no email exists', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@email.com',
        })
        .expect(400);

      expect(res.body.message).toBe('Please provide valid email and password');
    });
    it('should fail when no password exists', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          password: 'password',
        })
        .expect(400);
      expect(res.body.message).toBe('Please provide valid email and password');
    });

    it('should fail when no user exists', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@email.com',
          password: 'password',
        })
        .expect(401);
      expect(res.body.message).toBe('Incorrect email/password');
    });

    it('should fail with incorrect password', async () => {
      await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'test',
          email: 'test@email.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(201);
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@email.com',
          password: 'password1',
        })
        .expect(401);
      expect(res.body.message).toBe('Incorrect email/password');
    });
  });
});
