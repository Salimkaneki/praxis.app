'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Buttons/Button';

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code') || '500';

  const messages: Record<string, string> = {
    '401': "Vous n'êtes pas autorisé à accéder à cette page.",
    '403': "Accès interdit. Vous n'avez pas les permissions nécessaires.",
    '404': "Page non trouvée.",
    '500': "Une erreur est survenue. Veuillez réessayer plus tard."
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">{code}</h1>
      <p className="text-xl text-gray-700 mb-6">{messages[code] || messages['500']}</p>
      <Button
        onClick={() => router.push('/auth/sign-in')}
        size="large"
        width="w-60"
      >
        Retour à la connexion
      </Button>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    }>
      <ErrorPageContent />
    </Suspense>
  );
}
