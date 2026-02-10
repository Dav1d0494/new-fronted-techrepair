/**
 * Script para configurar usuarios en Firebase Firestore
 * 
 * INSTRUCCIONES:
 * 1. Ejecuta este código en la consola de Firebase (https://console.firebase.google.com)
 * 2. O créalo como un archivo temporal en tu proyecto y ejecútalo una vez
 * 
 * Este script configura los roles de los usuarios que mencionaste:
 * - Admin: Cristian.alarcon@itegperformance.com
 * - Técnico: Nain.zuñiga@itegperformance.com  
 * - Cliente: leonardo.martinez@gmail.com
 */

import { db, auth } from './lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const setupUsers = async () => {
  const users = [
    {
      email: 'Cristian.alarcon@itegperformance.com',
      password: 'Admin0001',
      role: 'admin',
      name: 'Cristian Alarcón',
      phone: '+1234567890'
    },
    {
      email: 'Nain.zuñiga@itegperformance.com',
      password: 'Performance2026#',
      role: 'tecnico',
      name: 'Nain Zuñiga',
      phone: '+1234567891'
    },
    {
      email: 'leonardo.martinez@gmail.com',
      password: 'leonardom00',
      role: 'user',
      name: 'Leonardo Martínez',
      phone: '+1234567892'
    }
  ];

  console.log('🚀 Iniciando configuración de usuarios...\n');

  for (const userData of users) {
    try {
      console.log(`📝 Procesando: ${userData.email}`);
      
      // Intentar crear el usuario en Firebase Auth (si no existe)
      let uid;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        uid = userCredential.user.uid;
        console.log(`  ✅ Usuario creado en Auth con UID: ${uid}`);
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          console.log(`  ⚠️ Usuario ya existe en Auth, buscando UID...`);
          // Si ya existe, necesitamos obtener el UID de otra manera
          // Por ahora, saltamos la creación del documento
          console.log(`  ℹ️ Debes hacer login manualmente para obtener el UID`);
          continue;
        } else {
          throw authError;
        }
      }

      // Crear o actualizar documento en Firestore
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        uid: uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        active: true
      }, { merge: true });

      console.log(`  ✅ Documento creado en Firestore`);
      console.log(`  🎯 Rol asignado: ${userData.role}\n`);

    } catch (error) {
      console.error(`  ❌ Error con ${userData.email}:`, error.message, '\n');
    }
  }

  console.log('✨ Configuración completada!\n');
  console.log('Resumen de usuarios:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  users.forEach(u => {
    console.log(`📧 ${u.email}`);
    console.log(`   Rol: ${u.role}`);
    console.log(`   Contraseña: ${u.password}`);
    console.log('');
  });
};

// Ejecutar el script
setupUsers().catch(console.error);


// ============================================
// ALTERNATIVA: Script manual para la consola de Firebase
// ============================================

/*
Si prefieres hacerlo manualmente desde la consola de Firebase:

1. Ve a Firebase Console > Firestore Database
2. Crea estos documentos en la colección "users":

DOCUMENTO 1 (obtén el UID después de crear el usuario en Authentication):
Collection: users
Document ID: [UID del usuario Cristian]
{
  "uid": "[UID del usuario]",
  "email": "Cristian.alarcon@itegperformance.com",
  "name": "Cristian Alarcón",
  "role": "admin",
  "createdAt": "2025-01-27T00:00:00.000Z",
  "active": true
}

DOCUMENTO 2:
Collection: users
Document ID: [UID del usuario Nain]
{
  "uid": "[UID del usuario]",
  "email": "Nain.zuñiga@itegperformance.com",
  "name": "Nain Zuñiga",
  "role": "tecnico",
  "createdAt": "2025-01-27T00:00:00.000Z",
  "active": true
}

DOCUMENTO 3:
Collection: users
Document ID: [UID del usuario Leonardo]
{
  "uid": "[UID del usuario]",
  "email": "leonardo.martinez@gmail.com",
  "name": "Leonardo Martínez",
  "role": "user",
  "createdAt": "2025-01-27T00:00:00.000Z",
  "active": true
}
*/