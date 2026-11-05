import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { moneyText } from '@/test/money'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/setup'

const LOAD_TIMEOUT = { timeout: 3000 }

describe('dashboard', () => {
  it('shows the total of deposit accounts once loaded', async () => {
    renderApp()

    expect(await screen.findByText(moneyText(17120.55), {}, LOAD_TIMEOUT)).toBeInTheDocument()
    expect(screen.getByText('Across 2 deposit accounts')).toBeInTheDocument()
    expect(screen.getByText(moneyText(-420.3))).toBeInTheDocument()
  })

  it('shows an error when loading fails and loads the dashboard on Retry', async () => {
    server.use(
      http.get(
        '*/api/accounts',
        () =>
          HttpResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Down' } },
            { status: 500 },
          ),
        { once: true },
      ),
    )
    const user = userEvent.setup()
    renderApp()

    expect(
      await screen.findByText("We couldn't load your dashboard.", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText(moneyText(17120.55), {}, LOAD_TIMEOUT)).toBeInTheDocument()
    expect(screen.queryByText("We couldn't load your dashboard.")).not.toBeInTheDocument()
  })
})
