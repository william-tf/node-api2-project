const express = require('express')
const Posts = require('../../data/db');
const router = express.Router();

router.get('/', async (req, res) => {
    const {query} = req

    try{
        const post = await Posts.find(query)
        res.status(200).json(post)
    }catch (error){
        res.json(error.message)
    }

})


router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Posts.insert(req.body)
    .then(posty => {
        res.status(201).json(posty)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post('/:id/comments', (req, res) => {
    const {id} = req.params
    const {comment} = req.body
    if(!id || !req.body.text){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    Posts.insertComment(comment)
    .then(c0mment => {
        res.status(201).json(c0mment)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message:'oop cannot save'})
    })
})

router.get('/:id', (req, res) => {
    const {id} = req.params
    Posts.findById(id)
    .then(postID => {
       if(postID){
     res.status(200).json(postID)
       } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
       }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: "Please provide text for the comment." })
    })
})

router.get('/:id/comments', (req, res) => {
    const {id} = req.params

    Posts.findPostComments(id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else{
            res.status(200).json(post)
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    
    Posts.remove(id)
    .then(ids =>{
        if(ids){
            res.status(200).json({message: 'do you feel powerful yet?'})
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The post could not be removed" })
    })
})

router.put('/:id', (req, res) => {
    const changes = req.body;

    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    Posts.update(req.params.id, changes)
    .then(post => {
        if(!post){
            res.status(404)
        } else{
            res.status(200).json(changes)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router