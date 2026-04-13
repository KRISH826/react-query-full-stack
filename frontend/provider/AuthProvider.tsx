import React from 'react'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='auth-provider'>
            {children}
        </div>
    )
}

export default AuthProvider