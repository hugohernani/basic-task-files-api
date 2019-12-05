'use strict'

const Task = use('App/Models/Task')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {Auth} ctx.auth
   */
  async index ({ request, response, view, auth }) {
    // const tasks = await Task.all()
    const tasks = await Task
      .query()
      .where('user_id', auth.user.id)
      .withCount('files as total_files')
      .fetch()
    // const tasks = Database.select('title', 'descritption').from('tasks').where({'user_id': auth.user.id})

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const {id} = auth.user

    const data = request.only(['title', 'descritption'])

    const task = await Task.create({...data, user_id: id})

    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const task = await Task.query().where('id', params.id).where('user_id','=',auth.user.id).first()

    if(!task){
      return response.status(404).send({message: 'None record found'})
    }

    await tarefa.load('files')
    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const { title, descritption } = request.all()

    const task = await Task.query().where('id', params.id).where('user_id','=',auth.user.id).first()

    if(!task){
      return response.status(404).send({message: 'None record found'})
    }

    task.title = title
    task.descritption = descritption

    await task.save()

    return task
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const task = await Task.query().where('id', params.id).where('user_id','=',auth.user.id).first()

    if(!task){
      return response.status(404).send({message: 'None record found'})
    }


    await task.delete()
    return response.status(200).send({message: 'Task was successfully deleted'})
  }
}

module.exports = TaskController
