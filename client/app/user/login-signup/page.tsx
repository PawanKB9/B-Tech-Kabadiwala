'use client'

import AuthSwitcher from '../../CommonCode/auth/authSwitcher'

export default function LoginSignupPage() {
  return (
    <div className=" py-16 h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide flex items-center justify-center bg-gray-100">
      <AuthSwitcher />
    </div>
  )
}
