// Script de test pour l'intégration API des notifications admin
// Utilisez ce script pour tester la connexion avec votre serveur Laravel

import { adminNotificationsService } from './src/app/(features)/dashboard/_services/A-Notifications.service.ts';

console.log('🧪 Test d\'intégration API Notifications Admin');
console.log('==============================================');

// ⚠️ IMPORTANT: Assurez-vous d'être connecté en tant qu'admin
// Le token sera automatiquement récupéré depuis localStorage par l'intercepteur axios

// Test du mode simulation (désactivez pour tester l'API réelle)
adminNotificationsService.setSimulationMode(true); // Changez à false pour tester l'API

console.log('🎭 Mode simulation:', adminNotificationsService.simulationMode ? 'Activé' : 'Désactivé');
console.log('🔑 Token admin dans localStorage:', localStorage.getItem('admin_token') ? '✅ Présent' : '❌ Manquant');

// Test 1: Envoyer à tous les enseignants
async function testSendToAll() {
  console.log('\n📤 Test 1: Envoi à tous les enseignants...');
  try {
    const response = await adminNotificationsService.sendToAllTeachers({
      type: 'admin_announcement',
      title: 'Test d\'intégration API',
      message: 'Ceci est un test automatique de l\'API de notifications',
      data: { priority: 'medium', test: true }
    });
    console.log('✅ Succès:', response);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Test 2: Récupérer les enseignants disponibles
async function testGetTeachers() {
  console.log('\n👥 Test 2: Récupération des enseignants...');
  try {
    const response = await adminNotificationsService.getAvailableTeachers();
    console.log('✅ Enseignants récupérés:', response.teachers.length, 'enseignants');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  await testSendToAll();
  await testGetTeachers();
  console.log('\n🎯 Tests terminés !');
}

runTests();