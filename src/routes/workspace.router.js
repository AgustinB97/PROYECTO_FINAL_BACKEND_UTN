import express, { request, response } from "express";
import { WorkspaceController } from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router()

workspaceRouter.get(
    '/all',
    WorkspaceController.getAll
)

export default workspaceRouter