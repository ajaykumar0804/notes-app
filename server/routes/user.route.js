import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUser, addNote, editNote, getAllNotes, deleteNote, updateNotePin, searchNote } from "../controllers/user.controller.js";



const router = express.Router();

router.get("/get-user", protectRoute, getUser);
router.post("/add-note", protectRoute, addNote);
router.put("/edit-note/:noteId",protectRoute,editNote);
router.get("/get-all-notes/",protectRoute,getAllNotes);
router.delete("/delete-note/:noteId",protectRoute,deleteNote);
router.put("/update-note-pinned/:noteId",protectRoute,updateNotePin);
router.get("/search-notes/",protectRoute,searchNote);

export default router; 