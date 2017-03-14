import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Post } from '.'

const app = () => express(routes)

let userSession, anotherSession, post

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  post = await Post.create({ user })
})

test('POST /posts 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, message: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.message).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /posts 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /posts 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /posts 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /posts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${post.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(post.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /posts/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${post.id}`)
  expect(status).toBe(401)
})

test('GET /posts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /posts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${post.id}`)
    .send({ access_token: userSession, message: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(post.id)
  expect(body.message).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /posts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${post.id}`)
    .send({ access_token: anotherSession, message: 'test' })
  expect(status).toBe(401)
})

test('PUT /posts/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${post.id}`)
  expect(status).toBe(401)
})

test('PUT /posts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, message: 'test' })
  expect(status).toBe(404)
})

test('DELETE /posts/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${post.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /posts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${post.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /posts/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${post.id}`)
  expect(status).toBe(401)
})

test('DELETE /posts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
