import express from "express";
import RisetController from "../controllers/RisetController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET ALL
router.get("/", RisetController.getAll);

// GET BY ID
router.get("/:id", RisetController.getById);

// CREATE
router.post("/", upload.single("dokumen"), RisetController.create);

// UPDATE
router.put("/:id", upload.single("dokumen"), RisetController.update);

// DELETE
router.delete("/:id", RisetController.delete);

export default router;
