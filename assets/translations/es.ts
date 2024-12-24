import AuthError from './es/errors/auth.json'
import auth from './es/auth.json'
import users from './es/users.json'
export default {
    auth: auth,
    users: users,
    errors: {
        auth: AuthError
    }
}