import _ from 'lodash'
import { success, emitStatus, notFound, authorOrAdmin } from '../../services/response/'
import { Post } from '.'

export const create = ({ user, bodymen: { body } }, res, next) => 
  Post.create({ ...body, user })
    .then((post) => (post.view(true)))
    .then(emitStatus(res, 201))
    .catch(next)
    
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Post.find(query, select, cursor)
    .populate('user')
    .then((posts) => posts.map((post) => post.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Post.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((post) => post ? post.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Post.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((post) => post ? _.merge(post, body).save() : null)
    .then((post) => post ? post.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((post) => post ? post.remove() : null)
    .then(success(res, 204))
    .catch(next)
