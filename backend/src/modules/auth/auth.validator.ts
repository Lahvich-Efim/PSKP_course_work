import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'hasUppercase', async: false })
class HasUppercaseConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        return typeof value === 'string' && /[A-Z]/.test(value);
    }
    defaultMessage(args: ValidationArguments) {
        return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
}
export function HasUppercase(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: HasUppercaseConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'hasLowercase', async: false })
class HasLowercaseConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        return typeof value === 'string' && /[a-z]/.test(value);
    }
    defaultMessage() {
        return 'Пароль должен содержать хотя бы одну строчную букву';
    }
}
export function HasLowercase(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: HasLowercaseConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'hasNumber', async: false })
class HasNumberConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        return typeof value === 'string' && /\d/.test(value);
    }
    defaultMessage() {
        return 'Пароль должен содержать хотя бы одну цифру';
    }
}
export function HasNumber(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: HasNumberConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'hasSpecialChar', async: false })
class HasSpecialCharConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        return (
            typeof value === 'string' &&
            /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(value)
        );
    }
    defaultMessage() {
        return 'Пароль должен содержать хотя бы один специальный символ';
    }
}
export function HasSpecialChar(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: HasSpecialCharConstraint,
        });
    };
}
