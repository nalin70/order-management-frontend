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
