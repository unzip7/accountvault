import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getgetSupabaseAdmin() } from '@/lib/supabase'


export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata.order_id

    // 1. Trouver une commande en attente
    const { data: order } = await getSupabaseAdmin()
      .from('orders')
      .select('*, product_categories(*)')
      .eq('id', orderId)
      .single()

    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })

    // 2. Trouver un compte disponible dans le stock
    const { data: account } = await getSupabaseAdmin()
      .from('account_stock')
      .select('*')
      .eq('category_id', order.category_id)
      .eq('status', 'available')
      .limit(1)
      .single()

    if (!account) return NextResponse.json({ error: 'Stock épuisé' }, { status: 500 })

    // 3. Marquer le compte comme vendu
    await getSupabaseAdmin()
      .from('account_stock')
      .update({ status: 'sold', sold_at: new Date().toISOString() })
      .eq('id', account.id)

    // 4. Mettre à jour la commande
    await getSupabaseAdmin()
      .from('orders')
      .update({
        status: 'delivered',
        account_id: account.id,
        delivered_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // 5. Log
    await getSupabaseAdmin()
      .from('activity_logs')
      .insert({
        user_id: order.user_id,
        action: 'ACCOUNT_DELIVERED',
        metadata: { order_id: orderId, account_id: account.id },
        status: 'success'
      })
  }

  return NextResponse.json({ received: true })
}