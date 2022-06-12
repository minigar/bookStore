const mongoose = require('mongoose')
const privatePaths = require('mongoose-private-paths')


const Schema = mongoose.Schema

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        private: true
    },

    books: [{
        type: Schema.Types.ObjectId,
        ref: 'books'
    }],

    karma: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users',
                    required: true
                },

                createDate: {
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

userSchema.plugin(privatePaths)

const populationFields = 'books'

userSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc.isPublic) {
            await doc.populate(populationFields)
        }
    }
})

userSchema.post('save', function(doc, next) {
    doc.populate(populationFields).then(function() {
        next();
    });
});

function populateFields() {
    this.populate(populationFields)
}

userSchema.pre('find', populateFields);
userSchema.pre('findOne', populateFields);
userSchema.pre('findOneAndUpdate', populateFields);

module.exports = mongoose.model('users', userSchema)