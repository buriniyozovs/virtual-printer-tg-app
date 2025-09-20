'use client'

import OrderUi from '@/containers/orders/OrderUi'
interface HomePageProps {
  searchParams: { [key: string]: string | undefined }
}
export default async function Home({ searchParams }: HomePageProps) {
  return <OrderUi userId={searchParams.userId} />
}
