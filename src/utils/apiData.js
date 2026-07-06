export function toArray(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export function formatCurrency(value) {
  const numberValue = Number(value ?? 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(numberValue) ? numberValue : 0)
}

export function getItemName(item) {
  return item?.product?.name ?? item?.product_name ?? item?.name ?? `Product #${item?.product_id ?? item?.id}`
}

function normalizeStatus(status) {
  return String(status ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_')
}

const completedPaymentStatuses = new Set(['completed', 'complete', 'paid', 'success', 'successful'])
const processingPaymentStatuses = new Set(['processing', 'payment_processing', 'in_progress'])

function getPaymentStatuses(order) {
  const directStatuses = [
    order?.payment_status,
    order?.paymentStatus,
    order?.payment?.status,
    order?.payment?.payment_status,
    order?.latest_payment?.status,
    order?.latest_payment?.payment_status,
    order?.latestPayment?.status,
    order?.latestPayment?.paymentStatus,
  ]

  const relatedPaymentStatuses = toArray(order?.payments).flatMap((payment) => [
    payment?.status,
    payment?.payment_status,
  ])

  return [...directStatuses, ...relatedPaymentStatuses].map(normalizeStatus).filter(Boolean)
}

export function getOrderPaymentState(order) {
  const paymentStatuses = getPaymentStatuses(order)

  if (paymentStatuses.some((status) => completedPaymentStatuses.has(status))) return 'paid'
  if (paymentStatuses.some((status) => processingPaymentStatuses.has(status))) return 'processing'

  const orderStatus = normalizeStatus(order?.status)

  if (completedPaymentStatuses.has(orderStatus)) return 'paid'
  if (orderStatus === 'payment_processing') return 'processing'

  return ''
}

export function canInitiateOrderPayment(order) {
  const orderStatus = normalizeStatus(order?.status)
  return !['cancelled', 'canceled'].includes(orderStatus) && !getOrderPaymentState(order)
}
