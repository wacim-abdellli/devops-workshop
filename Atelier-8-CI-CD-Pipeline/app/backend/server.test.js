const request = require('supertest');
const app = require('./server');

describe('Task Manager API', () => {
  
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'Test Task' };
      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', 'Test Task');
      expect(res.body).toHaveProperty('completed', false);
    });

    it('should reject task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject task with empty title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const res = await request(app)
        .put('/api/tasks/1')
        .send({ completed: true });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('completed', true);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/9999')
        .send({ completed: true });
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app).delete('/api/tasks/1');
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/9999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task', async () => {
      const res = await request(app).get('/api/tasks/2');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', 2);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/9999');
      expect(res.statusCode).toBe(404);
    });
  });
});
