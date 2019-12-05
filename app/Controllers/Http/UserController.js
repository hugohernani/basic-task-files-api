'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
  async create({request, response}) {
    try {

      const errorMessage = {
        'username.required': 'This field is mandatory',
        'username.unique': 'This user already exists',
        'username.min': 'The username field needs at least 6 characters'
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        email: 'required|email|unique:users',
        password: 'required|min:6'
      }, errorMessage)

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const data = request.only(['username', 'email', 'password'])

      const user = await User.create(data)

      return user

    } catch (e) {
      response.status(500).send({error: `Error: ${e.message}`})
    }
  }

  async login ({request, response, auth}) {
    try {
      const { email, password } = request.all()

      const validateToken = await auth.attempt(email, password)

      return validateToken
      
    } catch (e) {
      response.status(500).send({error: `Error: ${e.message}`})
    }
  }
}

module.exports = UserController
