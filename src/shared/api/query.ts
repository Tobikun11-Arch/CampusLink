import {
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

export function useAppQuery<
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useQuery(options);
}

export function useAppMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    invalidateQueries?: QueryKey[];
  }
) {
  const queryClient = useQueryClient();
  const invalidateQueries = options.invalidateQueries;
  const invalidate = ((queryClient as any).invalidateQueries?.bind(
    queryClient
  ) ?? (async () => undefined)) as (...args: any[]) => Promise<unknown>;

  return useMutation({
    ...options,
    onSuccess: async (data, variables, context) => {
      if (invalidateQueries?.length) {
        for (const queryKey of invalidateQueries) {
          await invalidate({queryKey} as any, undefined, undefined, undefined);
        }
      }
      const onSuccess: any = options.onSuccess;
      if (onSuccess) {
        await onSuccess(data, variables, context);
      }
    }
  });
}
