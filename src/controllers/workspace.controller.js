import WorkspaceRepository from "../repositories/workspace.repository.js";

export class WorkspaceController{
    static async getAll (request, response){

    const workspace = await WorkspaceRepository.getAll();

    response.send(
        {
            workspaces: workspace
        }
    )
}
}