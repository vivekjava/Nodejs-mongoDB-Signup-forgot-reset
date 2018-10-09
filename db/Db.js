'use strict'

const MongoClient = require('mongodb')

class Db {

  constructor (uri) {
    trace.info("Enter ******* Constructor");
    this.uri = uri
    this.db = {}
  }

  connect () {
    return new Promise((resolve, reject) => {
      console.log("Enter *******");
      MongoClient.connect(this.uri, (err, db) => {
        if (err) reject(err)
        this.db = db
        resolve(this)
      })
    })
  }

  addReport (domain) {
    return new Promise((resolve, reject) => {
      trace.info("Vivek Java");
      this.db.collection('domains').findAndModify(
        { domain: domain }
      , {}
      , { $inc: { reported: 1 } }
      , { new: true, upsert: true }
      , (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
    })

  }

  findReport (domain) {
    return new Promise((resolve, reject) => {
      this.db.collection('domains').findOne(
        { domain: domain }
      , { _id: false, reported: true }
      , (err, data) => {
          if (err) reject(err)
          if (data) {
            resolve(data.reported)
          } else {
            resolve(0)
          }
        })
    })
  }
}

module.exports = {Db};