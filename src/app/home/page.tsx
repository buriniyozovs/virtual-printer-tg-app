import OrderUi from '@/containers/orders/OrderUi'
interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  if (!resolvedSearchParams.userId) return

  return <OrderUi userId={resolvedSearchParams.userId} />
}
