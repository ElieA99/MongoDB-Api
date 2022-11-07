import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database'

export const employeesRouter = express.Router();
employeesRouter.use(express.json())

employeesRouter.get('/', async (req, res) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

employeesRouter.get('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };

        const employee = await collections.employees.findOne(query)

        if (employee) {
            res.status(200).send(employee)
        } else {
            res.status(404).send(`Failed to find the employee ID :${id}`)
        }
    } catch (error) {
        res.status(404).send('Failed to find the employee ID')
    }
})

employeesRouter.post('', async (req, res) => {
    try {
        const employee = req.body;
        const result = await collections.employees.insertOne(employee)

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}`)
        } else {
            res.status(500).send('Failed to create a new employee')
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(`Failed to create the employee ${error.message}`)
    }
})

employeesRouter.put('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.updateOne(query, { $set: employee })

        if (result && result.matchedCount) {
            res.status(200).send(`Employee Updated with ID : ${id}`)
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find employee with ID: ${id}`)
        } else {
            res.status(304).send(`Failed to update Employee : ${id}`)
        }
    } catch (error) {
        res.status(400).send(`Failed to Update the employee ID: Reason : ${error.message}`)
    }
})

employeesRouter.delete('/:id',async(req,res)=>{
    try {
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.deleteOne(query)

        if (result && result.deletedCount) {
            res.status(202).send(`We Removed Employee with id : ${id}`)
        } else if (!result){
            res.status(400).send(`Failed to remove Employee with id : ${id}`)
        }if (!result.deletedCount){
            res.status(404).send(`Failed to find Employee with id : ${id}`)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})