import User from '../models/user.model.js';
import Note from '../models/note.model.js';

//Get User details
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    console.log(user)
    const isUser = await User.findOne({ _id: user?._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "",
    });
    
  } catch (error) {
    console.log(`Error in Get User controller:${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
    
}

//Add Note

export const addNote = async (req, res) => {
 
  try {
    const { title, content, tags } = req.body;
    if (!title) {
        return res.status(400).json({ error:"Title is Required" });
    }
    if (!content) {
        return res.status(400).json({ error:"Content is Required" });
    }
        const note = new Note({
            title,
            content,
            tags:  [],
            userId: req.user?._id,
        });

        await note.save();
       
        return res.json({
            note,
            message: "Note Added successfully",
        });
    
    } catch (error) {
      console.log(`Error in Add Note controller:${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    } 
}

//Edit Note
export const editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const user = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No Changes Provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user?._id });
        
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not Found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
}

//Get All Notes
export const getAllNotes = async (req, res) => {
    const user  = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All Notes retrieved Successfully.",

        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
}

//Delete Note
export const deleteNote=async(req,res)=>{
    const noteId = req.params.noteId;
    const  user = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

//Update Note Pinned
export const updateNotePin=async(req,res)=>{
    const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const user = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not Found" });
    }


    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

//Search Note
export const searchNote=async(req,res)=>{
    const user =req.user;
  const {query} = req.query;

  if(!query){
    return res
      .status(400)
      .json({error:true,message:"Search query is required"});
  }

  try{
    const matchingNotes=await Note.find({
      userId:user._id,
      $or:[
        {title:{$regex:new RegExp(query,"i")}},
        {content:{$regex:new RegExp(query,"i")}},
      ],
    });

    return res.json({
      error:false,
      notes:matchingNotes,
      message:"Ntes matching the search Query retrieved successfully",
    });

  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal Server Error",
    });
  }
}