import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Types et interfaces
interface User {
  id: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  name: string
}

// Fonction pour récupérer le token depuis les cookies (middleware côté serveur)
function getTokenFromRequest(request: NextRequest): string | null {
  // On vérifie d'abord le cookie
  const cookieToken =
    request.cookies.get('admin_token')?.value ||
    request.cookies.get('teacher_token')?.value ||
    request.cookies.get('student_token')?.value
  if (cookieToken) return cookieToken

  // Puis le header Authorization (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}


// Fonction pour vérifier la validité du token (simplifiée - on ne vérifie que la présence)
function verifyToken(token: string): User | null {
  try {
    // Vérification basique : le token existe et fait une longueur minimale
    if (!token || token.length < 10) {
      return null
    }

    // On ne fait plus de vérification du contenu du token côté serveur
    // L'authentification réelle est gérée par le backend Laravel via les intercepteurs axios
    // On simule juste un utilisateur pour respecter l'interface
    return {
      id: '1',
      email: 'user@example.com',
      role: 'admin', // On laisse passer, le backend vérifiera réellement
      name: 'User'
    }
  } catch (error) {
    return null
  }
}

// Fonctions de redirection
function redirectToLogin(request: NextRequest): NextResponse {
  // Déterminer la page de connexion appropriée selon le contexte
  let loginPath = '/(features)/auth/sign-in'

  if (request.nextUrl.pathname.includes('/teacher') || request.nextUrl.pathname.includes('/teachers-dashboard')) {
    loginPath = '/(features)/auth/sign-in/teacher'
  } else if (request.nextUrl.pathname.includes('/student')) {
    loginPath = '/(features)/auth/sign-in/student'
  }

  return NextResponse.redirect(new URL(loginPath, request.url))
}

function redirectToUnauthorized(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/error-page?code=403', request.url))
}

// Fonction pour déterminer le rôle requis selon la route (plus utilisée)
function getRequiredRole(pathname: string): string[] {
  if (pathname.startsWith('/(features)/dashboard')) {
    return ['admin']
  }

  if (pathname.startsWith('/(features)/teachers-dashboard')) {
    return ['teacher']
  }

  if (pathname.startsWith('/(features)/student')) {
    return ['student']
  }

  if (pathname.startsWith('/(features)/(dashboard)')) {
    return ['admin', 'teacher'] // Accessible aux deux rôles
  }

  return []
}

export function middleware(request: NextRequest) {
  const token = getTokenFromRequest(request)

  // Routes nécessitant une authentification
  // - Dashboard admin complet
  // - Dashboard enseignants complet (quizzes, results, sessions et toutes leurs sous-routes)
  // - Routes pédagogiques partagées
  const protectedRoutes = [
    '/(features)/dashboard',
    '/(features)/teachers-dashboard',
    '/(features)/student',
    '/(features)/(dashboard)'
  ]

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    if (!token) {
      return redirectToLogin(request)
    }

    // On ne vérifie plus la validité du token côté serveur
    // L'authentification réelle est gérée par le backend Laravel
    const user = verifyToken(token)
    if (!user) {
      return redirectToLogin(request)
    }

    // Suppression de la vérification des rôles côté serveur
    // Le backend vérifiera les permissions réelles via les API
  }

  // Rediriger les utilisateurs connectés loin des pages de login
  // Simplifié car on ne peut plus déterminer le rôle côté serveur
  if (request.nextUrl.pathname.startsWith('/(features)/auth') && token) {
    // Laisser le frontend gérer la redirection appropriée après connexion
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Dashboard admin
    '/(features)/dashboard/:path*',
    // Dashboard enseignants - toutes les sous-routes
    '/(features)/teachers-dashboard/:path*',
    // Dashboard étudiants - toutes les sous-routes
    '/(features)/student/:path*',
    // Routes pédagogiques partagées
    '/(features)/(dashboard)/:path*',
    // Authentification
    '/(features)/auth/:path*'
  ]
}