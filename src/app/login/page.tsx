'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError('')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  console.log('data:', data)
  console.log('error:', error)

  if (error) {
    setError('Email ou mot de passe incorrect')
    setLoading(false)
    return
  }

  window.location.href = '/dashboard'
}   

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '24px' }}>
          Connexion
        </h1>
        <p style={{ color: '#a0a0b8', marginBottom: '28px', fontSize: '14px' }}>
          Accédez à votre espace AccountVault
        </p>

        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.12)',
            border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: '#f43f5e',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#a0a0b8', fontSize: '13px', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                background: '#1a1a24',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#a0a0b8', fontSize: '13px', marginBottom: '8px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                background: '#1a1a24',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #7c6aff, #a78bfa)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#a0a0b8' }}>
          Pas encore de compte ?{' '}
          <a href="/register" style={{ color: '#7c6aff', textDecoration: 'none' }}>
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  )
}