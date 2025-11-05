import mongoose from "mongoose";


const channelMessagesSchema = mongoose.Schema(
    {
        id_channel:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Channels',
            required: true
        },
        id_sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content:{
            type: String,
            required: true
        },
        create_at:{
            type: Date,
            default: Date.now,
            required: true
        }
    }
)


export const ChannelMessages = mongoose.model('ChannelMessage', channelMessagesSchema)




