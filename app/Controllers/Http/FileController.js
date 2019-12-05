'use strict'

const File = use('App/Models/File')
const Task = use('App/Models/Task')

const Helpers = use('Helpers')

class FileController {
  async create({params, request, response}) {
    // try {
      const task = await Task.findOrFail(params.id)

      const files = request.file('file', {
        size: '1mb'
      })

      await files.moveAll(Helpers.tmpPath('files'), file => ({
        name: `${Date.now()}--${file.clientName}`
      }))

      if(!files.movedAll()){
        return files.errors()
      }

      // await Promise.all(
      //   files.movedList().map(item => File.create({task_id: task.id, path: item.fileName}))
      // )

      await Promise.all(
        files.movedList().map(item => task.files().create({path: item.fileName}))
      )

      return response.status(200).send("Your files were correctly uploaded")
    //
    // } catch (e) {
    //   return response.status(500).send("Something went wrong uploading")
    // }
  }
}

module.exports = FileController
