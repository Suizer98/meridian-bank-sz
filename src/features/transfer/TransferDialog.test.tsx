import { screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { moneyText } from '@/test/money'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/setup'

const LOAD_TIMEOUT = { timeout: 3000 }

async function openTransferToJamie(user: UserEvent) {
  await user.click(await screen.findByRole('button', { name: 'New transfer' }, LOAD_TIMEOUT))
  const dialog = screen.getByRole('dialog', { name: 'New transfer' })

  await user.click(await within(dialog).findByRole('radio', { name: /Jamie Tan/ }, LOAD_TIMEOUT))
  await user.click(within(dialog).getByRole('button', { name: 'Continue' }))

  return dialog
}

describe('transfer', () => {
  it('shows an error for an amount over the balance and sends no request', async () => {
    const requests: string[] = []
    const recordRequest = ({ request }: { request: Request }) => {
      requests.push(`${request.method} ${new URL(request.url).pathname}`)
    }
    server.events.on('request:start', recordRequest)

    try {
      const user = userEvent.setup()
      renderApp()
      const dialog = await openTransferToJamie(user)

      const amount = within(dialog).getByLabelText('Amount')
      await user.type(amount, '5000')
      await user.click(within(dialog).getByRole('button', { name: 'Continue' }))

      expect(
        await within(dialog).findByText(
          `Amount can't be more than your available balance (${moneyText(4280.55)}).`,
        ),
      ).toBeInTheDocument()
      expect(amount).toHaveFocus()
      expect(within(dialog).getByRole('heading', { name: 'How much?' })).toBeInTheDocument()
      expect(requests.filter((request) => request.startsWith('POST'))).toEqual([])
    } finally {
      server.events.removeListener('request:start', recordRequest)
    }
  })

  it('shows the success screen and updates the dashboard after a transfer', async () => {
    const user = userEvent.setup()
    renderApp()
    const dialog = await openTransferToJamie(user)

    await user.type(within(dialog).getByLabelText('Amount'), '120')
    await user.click(within(dialog).getByRole('button', { name: 'Continue' }))
    await user.click(within(dialog).getByRole('button', { name: 'Confirm transfer' }))

    expect(within(dialog).getByRole('button', { name: 'Sending…' })).toBeDisabled()
    expect(
      await within(dialog).findByRole('heading', { name: 'Transfer sent' }, LOAD_TIMEOUT),
    ).toBeInTheDocument()
    expect(within(dialog).getByText(/^TRF-/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Back to dashboard' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(moneyText(17000.55))).toBeInTheDocument()
    expect(screen.getByText('Transfer to Jamie Tan')).toBeInTheDocument()
    expect(screen.getByText(moneyText(4880))).toBeInTheDocument()
  })

  it('stays on the review step with an alert when sending fails', async () => {
    const user = userEvent.setup()
    renderApp()
    const dialog = await openTransferToJamie(user)

    await user.type(within(dialog).getByLabelText('Amount'), '120')
    await user.type(within(dialog).getByLabelText('Note (optional)'), 'Dinner #fail')
    await user.click(within(dialog).getByRole('button', { name: 'Continue' }))
    await user.click(within(dialog).getByRole('button', { name: 'Confirm transfer' }))

    expect(await within(dialog).findByRole('alert', {}, LOAD_TIMEOUT)).toHaveTextContent(
      "Something went wrong. Your money hasn't left your account. Try again.",
    )
    expect(within(dialog).getByRole('heading', { name: 'Check the details' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Confirm transfer' })).toBeEnabled()
    expect(within(dialog).getByText('Dinner #fail')).toBeInTheDocument()
  })
})
