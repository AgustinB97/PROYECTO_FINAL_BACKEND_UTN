import mongoose from "mongoose";

const memberWorkspaceSchema = new mongoose.Schema(
    {
        id_user:{
            //id_user sera un id de monngoDB
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        id_workspace:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspaces',
            required: true
        },
        role:{
            type:String
        },
        created_at:{
            type: Date,
            default: Date.now,
            required: true
    }
}
)

const MemberWorkspace = mongoose.model('MemberWorkspace', memberWorkspaceSchema)

export default MemberWorkspace