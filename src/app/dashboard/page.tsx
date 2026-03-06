'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = '/login'
        return
      }
      
      setUser(session.user)

      const { data: orders } = await supabase
        .from('orders')
        .select('*, product_categories(*), account_stock(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setOrders(orders || [])
      setLoading(false)
    }

    getSession()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '16px'
    }}>
      ⟳ Chargement...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050508', fontFamily: 'sans-serif', color: 'white' }}>

      {/* Header */}
      <div style={{
        background: '#0c0c12',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700' }}>⚡ AccountVault</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#a0a0b8', fontSize: '14px' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            color: '#a0a0b8',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Bonjour {user?.user_metadata?.name || 'Utilisateur'} 👋
          </h1>
          <p style={{ color: '#a0a0b8', fontSize: '14px' }}>
            Voici un résumé de votre activité
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Commandes', value: orders.length, color: '#7c6aff' },
            { label: 'Comptes livrés', value: orders.filter(o => o.status === 'delivered').length, color: '#22d3a0' },
            { label: 'Total dépensé', value: orders.reduce((acc, o) => acc + Number(o.amount), 0).toFixed(2) + '€', color: '#f59e0b' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '12px', color: '#606078', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>Mes commandes</div>
            <a href="/" style={{ color: '#7c6aff', fontSize: '14px', textDecoration: 'none' }}>+ Acheter</a>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#606078' }}>
              Aucune commande —{' '}
              <a href="/" style={{ color: '#7c6aff', textDecoration: 'none' }}>Voir le catalogue</a>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Référence', 'Produit', 'Prix', 'Date', 'Statut'].map(h => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontSize: '11px', color: '#606078',
                      textTransform: 'uppercase', letterSpacing: '1px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#606078', fontFamily: 'monospace' }}>{order.order_ref}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px' }}>{order.product_categories?.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#7c6aff' }}>{order.amount}€</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#a0a0b8' }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '100px', fontSize: '12px',
                        background: order.status === 'delivered' ? 'rgba(34,211,160,0.12)' : 'rgba(245,158,11,0.12)',
                        color: order.status === 'delivered' ? '#22d3a0' : '#f59e0b'
                      }}>
                        {order.status === 'delivered' ? 'Livré' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}