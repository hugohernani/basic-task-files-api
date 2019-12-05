'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')



Route.post('/user', 'UserController.create')
Route.post('/login', 'UserController.login')

Route.resource('task', 'TaskController').apiOnly().middleware('auth')
Route.post('/task/:id/file', 'FileController.create').middleware('auth')
