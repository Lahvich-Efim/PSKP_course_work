import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

type ConditionFn<T> = (obj: T) => boolean;

@ValidatorConstraint({ name: 'RequiredIf', async: false })
export class RequiredIfConstraint implements ValidatorConstraintInterface {
    private condition!: ConditionFn<any>;

    constructor(condition?: ConditionFn<any>) {
        if (condition) this.condition = condition;
    }

    validate(value: any, args: ValidationArguments) {
        const obj = args.object as { [key: string]: any };

        if (this.condition(obj)) {
            return value !== null && value !== undefined;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} is required by condition`;
    }
}

export function RequiredIf<T>(
    condition: ConditionFn<T>,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'RequiredIf',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [condition],
            validator: RequiredIfConstraint,
        });
    };
}
