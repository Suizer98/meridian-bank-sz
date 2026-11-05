import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './client'
import { withDemoParams } from './demo'
import type {
  AccountsResponse,
  CreateTransferRequest,
  CustomerResponse,
  PayeesResponse,
  TransactionsResponse,
  TransferResponse,
} from './types'

export const RECENT_TRANSACTIONS_LIMIT = 8

export const queryKeys = {
  customer: ['customer'],
  accounts: ['accounts'],
  transactions: ['transactions'],
  recentTransactions: ['transactions', { limit: RECENT_TRANSACTIONS_LIMIT }],
  payees: ['payees'],
} as const

function getJson<T>(path: string): Promise<T> {
  return apiFetch<T>(withDemoParams(path))
}

export function useCustomer() {
  return useQuery({
    queryKey: queryKeys.customer,
    queryFn: () => getJson<CustomerResponse>('/api/customer'),
    select: (data) => data.customer,
  })
}

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => getJson<AccountsResponse>('/api/accounts'),
    select: (data) => data.accounts,
  })
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: queryKeys.recentTransactions,
    queryFn: () =>
      getJson<TransactionsResponse>(
        `/api/transactions?limit=${RECENT_TRANSACTIONS_LIMIT}`,
      ),
    select: (data) => data.transactions,
  })
}

export function usePayees() {
  return useQuery({
    queryKey: queryKeys.payees,
    queryFn: () => getJson<PayeesResponse>('/api/payees'),
    select: (data) => data.payees,
  })
}

export function useCreateTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateTransferRequest) =>
      apiFetch<TransferResponse>('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }),
    // Returning the promise keeps the mutation pending until the dashboard
    // data has been refetched, so the success screen never shows stale data.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.customer }),
        queryClient.invalidateQueries({ queryKey: queryKeys.accounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
      ]),
  })
}
