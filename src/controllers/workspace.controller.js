import WorkspaceRepository from "../repositories/worksapace.repository.js";

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