import { defaultFieldResolver } from "graphql"
import { SchemaDirectiveVisitor } from 'graphql-tools'

class UpperCaseDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;

        field.resolve = async (obj, args, context, info) => {
            const result = await resolve.apply(this, [obj, args, context, info])

            if (typeof result === "string") {
                return result.toUpperCase();
            }
            return result;
        }
    }
}

class IsUserDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field
        field.resolve = async function (...argsArray) {
            const result = await resolve.apply(this, argsArray)
            const [obj, args, context] = argsArray
            const { user } = context

            if (user && user._id === obj._id) {
                return result
            }

            return null
        }
    }
}

export { UpperCaseDirective, IsUserDirective }