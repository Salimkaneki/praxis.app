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


// Fonction pour vérifier la validité du token (version simplifiée pour le middleware)
function verifyToken(token: string): User | null {
  try {
    // Pour l'instant, on fait une vérification basique
    // TODO: Implémenter la vérification JWT complète
    if (!token || token.length < 10) {
      return null
    }

    // Simulation d'un utilisateur basé sur le token
    // En production, décoder le JWT pour obtenir les vraies informations
    let role: 'admin' | 'teacher' | 'student' = 'teacher'; // default

    if (token.includes('admin')) {
      role = 'admin';
    } else if (token.includes('teacher')) {
      role = 'teacher';
    } else if (token.includes('student')) {
      role = 'student';
    }

    return {
      id: '1',
      email: 'user@example.com',
      role: role,
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

// Fonction pour déterminer le rôle requis selon la route
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

    const user = verifyToken(token)
    if (!user) {
      return redirectToLogin(request)
    }

    // Vérifier les permissions selon la route
    const requiredRoles = getRequiredRole(request.nextUrl.pathname)
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return redirectToUnauthorized(request)
    }
  }

  // Rediriger les utilisateurs connectés loin des pages de login
  if (request.nextUrl.pathname.startsWith('/(features)/auth') && token) {
    const user = verifyToken(token)
    if (user) {
      // Rediriger selon le rôle
      switch (user.role) {
        case 'admin':
          return NextResponse.redirect(new URL('/(features)/dashboard', request.url))
        case 'teacher':
          return NextResponse.redirect(new URL('/(features)/teachers-dashboard', request.url))
        case 'student':
          return NextResponse.redirect(new URL('/(features)/student', request.url))
        default:
          return NextResponse.redirect(new URL('/', request.url))
      }
    }
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