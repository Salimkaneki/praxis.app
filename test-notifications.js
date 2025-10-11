// Script de test pour le service de notifications admin
// À exécuter dans la console du navigateur pour tester les fonctionnalités

import { adminNotificationsService } from './A-Notifications.service.ts';

// Test du mode simulation
console.log('=== Test du Service de Notifications Admin ===');

// Activer le mode simulation
adminNotificationsService.setSimulationMode(true);
console.log('✅ Mode simulation activé');

// Test d'envoi à tous les enseignants
console.log('\n📤 Test: Envoi à tous les enseignants...');
adminNotificationsService.sendToAllTeachers({
  type: 'admin_announcement',
  title: 'Test de notification',
  message: 'Ceci est un test du système de notifications',
  data: { priority: 'medium' }
}).then(response => {
  console.log('✅ Réponse reçue:', response);
}).catch(error => {
  console.error('❌ Erreur:', error.message);
});

// Test de récupération des enseignants
console.log('\n👥 Test: Récupération des enseignants...');
adminNotificationsService.getAvailableTeachers()
  .then(response => {
    console.log('✅ Enseignants récupérés:', response.teachers.length, 'enseignants');
  }).catch(error => {
    console.error('❌ Erreur:', error.message);
});

// Test avec recherche
console.log('\n🔍 Test: Recherche d\'enseignants...');
adminNotificationsService.getAvailableTeachers('Marie')
  .then(response => {
    console.log('✅ Résultats de recherche:', response.teachers);
  }).catch(error => {
    console.error('❌ Erreur:', error.message);
});

console.log('\n🎯 Tests terminés. Vérifiez la console pour les résultats.');