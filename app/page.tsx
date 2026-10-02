import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to login page - middleware will handle authentication redirects
  redirect('/login')
}