import mongoose from "mongoose"




const workspacesSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        url_image:{
            type: String,
            required: true,
            unique: false
        },
        created_at:{
            type: Date,
            default: Date.now,
            required: true
        },
        modified_at:{
            type: Date,
            default: null
        },
        active:{
            type: Boolean,
            default: true,
            required: true
        }
    }
)

const Workspaces = mongoose.model('Workspaces', workspacesSchema)

export default Workspaces