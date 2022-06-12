const { Schema, model } = require('mongoose');


const bookSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },

    author: {
        type: Schema.Types.String,
        ref: 'users',
        required: true
    },

    cost:{
        type: Number,
        required: true
    },

    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
        
            createdDate: {
                type: Date,
                default: Date.now
            }
        }
    ],

    comments: [
        {
            body: {
                type: String,
                required: true
            },

            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            likes: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'users',
                        required: true
                    },
                
                    createdDate: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],

            createdDate: {
                type: Date,
                default: Date.now
            }
        }
    ],

    createdDate: {
        type: Date,
        default: Date.now
    }
})

const populationFields = 'comments.user' 

// if const populationFields = 'user' we get full user object from all user's Schema feilds

bookSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc.isPublic) {
            await doc.populate(populationFields)
        }
    }
})

bookSchema.post('save', function(doc, next) {
    doc.populate(populationFields).then(function() {
        next();
    });
});

function populateFields() {
    this.populate(populationFields)
}

bookSchema.pre('find', populateFields);
bookSchema.pre('findOne', populateFields);
bookSchema.pre('findOneAndUpdate', populateFields);

module.exports = model('books', bookSchema)