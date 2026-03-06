'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Mot de passe trop court (minimum 6 caractères)')
      setLoading(false)
      return
    }

    // 1. Créer le compte Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Créer le profil dans la table users
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
        role: 'user',
        plan: 'free'
      })
    }

    router.push('/dashboard')
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
          Créer un compte
        </h1>
        <p style={{ color: '#a0a0b8', marginBottom: '28px', fontSize: '14px' }}>
          Rejoignez AccountVault gratuitement
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#a0a0b8', fontSize: '13px', marginBottom: '8px' }}>
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jean Dupont"
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
              placeholder="Minimum 6 caractères"
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
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#a0a0b8' }}>
          Déjà un compte ?{' '}
          <a href="/login" style={{ color: '#7c6aff', textDecoration: 'none' }}>
            Se connecter
          </a>
        </div>
      </div>
    </div>
  )
}