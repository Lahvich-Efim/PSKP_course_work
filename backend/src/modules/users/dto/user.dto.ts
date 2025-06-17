import { User, UserData } from '../user.entity';

export class UserDto implements UserData {
    id: number;
    username: string;
    email: string;
    role: 'PARTICIPANT' | 'COORDINATOR';

    static fromEntity(entity: User): UserDto {
        const dto = new UserDto();
        dto.id = entity.id;
        dto.username = entity.username;
        dto.email = entity.email;
        dto.role = entity.role;
        return dto;
    }
}

export class CreateUserDto implements Omit<User, 'id'> {
    username: string;
    email: string;
    password: string;
    role: 'PARTICIPANT' | 'COORDINATOR';
}
