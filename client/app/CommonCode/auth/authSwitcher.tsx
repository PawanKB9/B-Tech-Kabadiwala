'use client'

import { useState } from 'react'
import LoginForm from './login'
import SignUpPage from './signup'

type Mode = 'login' | 'signup'

interface Props {
  allowSkip?: boolean
  onSkip?: () => void
}

export default function AuthSwitcher({
  allowSkip = true,
  onSkip,
}: Props) {
  const [mode, setMode] = useState<Mode>('login')

  return (
    <div className="auth-box">
      {mode === 'login' ? <LoginForm /> : <SignUpPage />}

      <div className='bg-white  shadow-md text-blue-700 flex justify-between p-3 rounded-lg'>
          <button
          type="button" className='italic underline'
          onClick={() =>
            setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
          }
        >
          {mode === 'login'
            ? 'Create an account!'
            : 'Already have an account?'}
        </button>

        {allowSkip && (
          <button type="button" className='font-bold' onClick={onSkip}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
