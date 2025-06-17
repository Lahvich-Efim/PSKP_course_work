import { useInvalidateMutation } from './useInvalidateMutation';
import type { Participant } from '@/models/participant';
import { ParticipantService } from '@/service/PatricipantService.ts';
import { AuthService } from '@/service/AuthService.ts';

const participantService = new ParticipantService();
const authService = new AuthService();

export function useUpdateParticipant(onDone?: () => void) {
    return useInvalidateMutation<
        { id: number; data: Partial<Participant> },
        Participant
    >({
        mutationFn: ({ id, data }) =>
            participantService.updateParticipant(id, data),
        invalidateKeys: [['participants']],
        onSuccessCallback: onDone,
    });
}

export function useDeleteParticipant(onDone?: () => void) {
    return useInvalidateMutation<number, Participant>({
        mutationFn: (id) => participantService.deleteParticipant(id),
        invalidateKeys: [['participants']],
        onSuccessCallback: onDone,
    });
}

export interface RegisterParticipantInput {
    username: string;
    email: string;
    password: string;
    name: string;
    description?: string;
}

export function useRegisterParticipant(onDone?: () => void) {
    return useInvalidateMutation<RegisterParticipantInput, Participant>({
        mutationFn: async (input) => {
            const user = await authService.register({
                username: input.username,
                email: input.email,
                password: input.password,
                role: 'PARTICIPANT',
            });

            return participantService.createParticipant({
                id: user.id,
                name: input.name,
                description: input.description,
            });
        },

        invalidateKeys: [['participants']],
        onSuccessCallback: onDone,
    });
}
