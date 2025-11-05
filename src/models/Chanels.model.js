import mongoose from "mongoose";


const ChannelsSchema = new mongoose.Schema(
    {
        id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        private:{
            type: Boolean,
            default: true
        },
        active: {
            type: Boolean,
            default: true
        },
        create_at:{
            type: Date,
            default: Date.now,
            required: true
        },
        modified_at:{
            type: Date,
            default: null,
        }
        
    }
)

export const Channels = mongoose.model('Channels', ChannelsSchema)