import AuthError from './en/errors/auth.json'
import auth from './en/auth.json'
import users from './en/users.json'
export default {
    auth: auth,
    users: users,
    errors: {
        auth: AuthError
    }
}