import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { 
		type: String, 
		required: true,
		validate: {
			validator: (value: string): boolean => {
				return /^\w+@\w+\.\w+$/.test(value);
			},
			message: 'Invalid email format'
		}
	},
	authentication: {
		password: { type: String, required: true, select: false },
		salt: { type: String, required: true, select: false },
		sessionToken: { type: String, select: false }
	}
});

export const userModel = mongoose.model('User', UserSchema);

export const createUser = (values: Record<string, any>) => new userModel(values).save().then((user) => { return user.toObject() });

export const getAllUsers = () => userModel.find();

export const getUserByEmail = (email: string) => userModel.findOne( { email } );

export const getUserBySessionToken = (sessionToken: string) => userModel.findOne( { 'authentication.sessionToken': sessionToken } );

export const getUserById = (id: string) => userModel.findById(id);


