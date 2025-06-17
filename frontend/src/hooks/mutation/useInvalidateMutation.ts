import {
    useMutation,
    useQueryClient,
    type QueryKey,
} from '@tanstack/react-query';

interface UseInvalidateMutationOptions<Variables, Result> {
    mutationFn: (vars: Variables) => Promise<Result>;
    invalidateKeys: QueryKey[];
    onSuccessCallback?: (data: Result) => void;
}

export function useInvalidateMutation<Variables, Result>({
    mutationFn,
    invalidateKeys,
    onSuccessCallback,
}: UseInvalidateMutationOptions<Variables, Result>) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (data) => {
            invalidateKeys.forEach((key) => {
                qc.invalidateQueries({ queryKey: key });
            });
            onSuccessCallback?.(data);
        },
    });
}
