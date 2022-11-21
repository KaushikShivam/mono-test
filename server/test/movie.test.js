const request = require('supertest');

const app = require('../app');
const { userOne, movieOne } = require('./fixtures/data');

describe('Movies Fetched', () => {
  describe('successfully', () => {
    it('should return movies array with 200 code', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);

      await request(app)
        .post('/api/v1/movies')
        .send(movieOne)
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .expect(201);

      const res = await request(app)
        .get('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .expect(200);
      expect(res.body.data.movies.length).toEqual(1);
    });
  });
  describe('unsuccessfully', () => {
    it('should return 401 with a non-logged in user', async () => {
      await request(app).get('/api/v1/movies').expect(401);
    });
  });
});

describe('Movie Created', () => {
  describe('successfully', () => {
    it('should create a new movie with 201 success code', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      expect(movie.body.data.movie.creator).toBe(user.body.data.user._id);
    });
  });

  describe('unsuccessfully', () => {
    it('should send a 401 code without a logged in user', async () => {
      await request(app).post('/api/v1/users/signup').send(userOne).expect(201);
      await request(app).post('/api/v1/movies').send(movieOne).expect(401);
    });

    it('should send 400 with invalid data', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({})
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(7);
      expect(res.body.errors).toContain('Movie should have a title');
      expect(res.body.errors).toContain('Movie should have a description');
      expect(res.body.errors).toContain('Movie should have a watch url');
      expect(res.body.errors).toContain('Movie should have a category');
      expect(res.body.errors).toContain(
        'Movie should have a country of origin'
      );
      expect(res.body.errors).toContain('Movie should have a director');
      expect(res.body.errors).toContain('Movie should have a duration');
    });

    it('should send 400 with no title', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          description: 'A greate movie',
          thumbnail: 'www.thumbnail.com',
          watchUrl: 'www.netflix.com',
          category: 'Fantasy',
          countryOfOrigin: 'India',
          director: 'Director',
          duration: 200,
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie should have a title');
    });

    it('should send 400 with no description', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          thumbnail: 'www.thumbnail.com',
          watchUrl: 'www.netflix.com',
          category: 'Fantasy',
          countryOfOrigin: 'India',
          director: 'Director',
          duration: 200,
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie should have a description');
    });

    it('should send 400 with no watch url', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          category: 'Fantasy',
          countryOfOrigin: 'India',
          director: 'Director',
          duration: 200,
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie should have a watch url');
    });

    it('should send 400 with no category', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          watchUrl: 'wwww.watch.com',
          countryOfOrigin: 'India',
          director: 'Director',
          duration: 200,
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie should have a category');
    });

    it('should send 400 with no origin', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          watchUrl: 'wwww.watch.com',
          category: 'India',
          director: 'Director',
          duration: 200,
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain(
        'Movie should have a country of origin'
      );
    });

    it('should send 400 with no duration', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          watchUrl: 'wwww.watch.com',
          category: 'Fantasy',
          countryOfOrigin: 'India',
          director: 'Director',
          rating: 4.5,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie should have a duration');
    });

    it('should send 400 if rating is less than 1', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          watchUrl: 'wwww.watch.com',
          category: 'Fantasy',
          duration: 200,
          countryOfOrigin: 'India',
          director: 'Director',
          rating: 0,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie rating should be above 1');
    });

    it('should send 400 if rating is more than 5', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const res = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send({
          title: 'A greate movie',
          description: 'decription',
          watchUrl: 'wwww.watch.com',
          category: 'Fantasy',
          duration: 200,
          countryOfOrigin: 'India',
          director: 'Director',
          rating: 6,
        })
        .expect(400);
      expect(res.body.message).toBe('Invalid data');
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors).toContain('Movie rating should be below 1');
    });
  });
});

describe('Movie Fetched', () => {
  describe('successfully', () => {
    it('should return a single movie with 200 code', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      const res = await request(app)
        .get(`/api/v1/movies/${movie.body.data.movie._id}`)
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .expect(200);
      expect(res.body.data.movie.title).toBe(movie.body.data.movie.title);
      expect(res.body.data.movie._id).toBe(movie.body.data.movie._id);
    });
  });
  describe('unsuccessfully', () => {
    it('should return 401 with a non-logged in user', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      await request(app)
        .get(`/api/v1/movies/${movie.body.data.movie._id}`)
        .expect(401);
    });
  });
});

describe('Movie Updated', () => {
  describe('successfully', () => {
    it('should return the updated movie with 200 code', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      const res = await request(app)
        .patch(`/api/v1/movies/${movie.body.data.movie._id}`)
        .send({ title: 'movie title', description: 'movie description' })
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .expect(200);
      expect(res.body.data.movie.title).toBe('movie title');
      expect(res.body.data.movie.description).toBe('movie description');
      expect(res.body.data.movie._id).toBe(movie.body.data.movie._id);
    });
  });
  describe('unsuccessfully', () => {
    it('should return 401 with a non-logged in user', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      await request(app)
        .patch(`/api/v1/movies/${movie.body.data.movie._id}`)
        .send({ title: 'Title' })
        .expect(401);
    });
  });
});

describe('Movie Deleted', () => {
  describe('successfully', () => {
    it('should return the 201 code', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      await request(app)
        .delete(`/api/v1/movies/${movie.body.data.movie._id}`)
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .expect(204);
    });
  });
  describe('unsuccessfully', () => {
    it('should return 401 with a non-logged in user', async () => {
      const user = await request(app)
        .post('/api/v1/users/signup')
        .send(userOne)
        .expect(201);
      const movie = await request(app)
        .post('/api/v1/movies')
        .set('Authorization', `Bearer ${user.body.data.token}`)
        .send(movieOne)
        .expect(201);
      await request(app)
        .delete(`/api/v1/movies/${movie.body.data.movie._id}`)
        .send({ title: 'Title' })
        .expect(401);
    });
  });
});
