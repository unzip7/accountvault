'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PRODUCTS = [
  {
    id: 1, title: 'Compte Vierge', level: 1, badge: '⬡ Niveau 1',
    desc: 'Compte neuf sans historique, idéal pour démarrer.',
    features: ['Compte sans historique', 'Email vérifié', 'Création récente'],
    price: 9.99, stock: 142, color: '#38bdf8'
  },
  {
    id: 2, title: 'Compte Lutin', level: 51, badge: '✦ Niveau 51',
    desc: 'Compte développé niveau 51 avec progression avancée.',
    features: ['Niveau 51 certifié', 'Historique actif', 'Réalisations débloquées'],
    price: 49.99, stock: 38, color: '#a78bfa'
  },
  {
    id: 3, title: 'Compte Certifié', level: 0, badge: '✓ Certifié',
    desc: 'Compte vérifié avec badge officiel.',
    features: ['Badge de vérification', 'Identité confirmée', 'Score de confiance élevé'],
    price: 89.99, stock: 15, color: '#f59e0b'
  },
  {
    id: 4, title: 'Abonnement Premium', level: 0, badge: '◈ Sub Actif',
    desc: 'Compte avec abonnement premium actif 30 jours.',
    features: ['Abonnement actif 30j', 'Toutes les fonctionnalités', 'Support prioritaire'],
    price: 129.99, stock: 7, color: '#22d3a0'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: 'sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 32px',
        background: 'rgba(5,5,8,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700' }}>⚡ AccountVault</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#a0a0b8', fontSize: '14px' }}>{user.email}</span>
              <button onClick={() => router.push('/dashboard')} style={{
                padding: '8px 16px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', color: '#a0a0b8', cursor: 'pointer', fontSize: '14px'
              }}>Mon espace</button>
              <button onClick={handleLogout} style={{
                padding: '8px 16px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', color: '#a0a0b8', cursor: 'pointer', fontSize: '14px'
              }}>Déconnexion</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')} style={{
                padding: '8px 16px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', color: '#a0a0b8', cursor: 'pointer', fontSize: '14px'
              }}>Connexion</button>
              <button onClick={() => router.push('/register')} style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #7c6aff, #a78bfa)',
                border: 'none', borderRadius: '8px', color: 'white',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}>Commencer</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: '160px', paddingBottom: '80px', textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,106,255,0.15) 0%, transparent 60%)'
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 14px',
          background: 'rgba(124,106,255,0.12)',
          border: '1px solid rgba(124,106,255,0.25)',
          borderRadius: '100px', fontSize: '13px', color: '#c4b5fd',
          marginBottom: '28px'
        }}>
          ● Livraison automatique · Paiement sécurisé
        </div>
        <h1 style={{ fontSize: 'clamp(40px,7vw,72px)', fontWeight: '800', lineHeight: '1.05', marginBottom: '24px' }}>
          La marketplace de<br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#22d3a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            comptes numériques
          </span>
        </h1>
        <p style={{ fontSize: '18px', color: '#a0a0b8', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Achetez des comptes certifiés et leveled. Livraison instantanée, stock vérifié, support 24/7.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '14px 28px', background: 'linear-gradient(135deg,#7c6aff,#a78bfa)',
              border: 'none', borderRadius: '10px', color: 'white',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer'
            }}>
            Voir les produits →
          </button>
          <button
            onClick={() => router.push('/register')}
            style={{
              padding: '14px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', color: '#a0a0b8', fontSize: '15px', cursor: 'pointer'
            }}>
            Créer un compte gratuit
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', color: '#7c6aff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Catalogue
        </div>
        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '48px' }}>
          Nos produits disponibles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '24px',
              transition: 'all 0.3s', cursor: 'pointer'
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              <span style={{
                display: 'inline-block', padding: '4px 10px',
                background: `${p.color}20`, color: p.color,
                borderRadius: '100px', fontSize: '11px', fontFamily: 'monospace',
                marginBottom: '16px'
              }}>
                {p.badge}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{p.title}</h3>
              <p style={{ fontSize: '13px', color: '#a0a0b8', lineHeight: '1.6', marginBottom: '20px' }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#a0a0b8' }}>
                    <span style={{ color: '#22d3a0' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <span style={{ fontSize: '26px', fontWeight: '700' }}>{p.price}€</span>
                  <div style={{ fontSize: '12px', color: '#606078', marginTop: '4px' }}>{p.stock} en stock</div>
                </div>
                <button
                  onClick={() => user ? router.push('/dashboard') : router.push('/login')}
                  style={{
                    padding: '9px 18px',
                    background: 'linear-gradient(135deg,#7c6aff,#a78bfa)',
                    border: 'none', borderRadius: '8px', color: 'white',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                  Acheter →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '32px', textAlign: 'center',
        color: '#606078', fontSize: '14px'
      }}>
        © 2024 AccountVault — 🔐 SSL · 💳 Stripe · ₿ Crypto
      </footer>

    </div>
  )
}