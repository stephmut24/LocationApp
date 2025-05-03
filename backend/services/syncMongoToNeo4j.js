import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import neo4jConnect from '../config/neo4j.js';

dotenv.config();

async function syncMongoToNeo4j() {
  const mongoUri = process.env.MONGO_URI;
  const mongoDbName = process.env.MONGO_DB_NAME;
  const mongoClient = new MongoClient(mongoUri);
  const neo4jDriver = await neo4jConnect();
  const session = neo4jDriver.session();

  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoClient.connect();
    console.log('✅ Connecté à MongoDB');

    const db = mongoClient.db(mongoDbName);

    console.log('🔌 Connexion à Neo4j...');
    if (!neo4jDriver) {
      throw new Error('Échec de la connexion à Neo4j');
    }
    console.log('✅ Connecté à Neo4j');

    // 1. Hôpitaux
    const hospitals = await db.collection('hospitals').find().toArray();
    console.log(`🏥 ${hospitals.length} hôpitaux trouvés`);
    for (const hospital of hospitals) {
      await session.run(`
        MERGE (h:Hospital {id: $id})
        SET h.name = $name, h.latitude = $lat, h.longitude = $lng
      `, {
        id: hospital._id.toString(),
        name: hospital.name,
        lat: hospital.location.coordinates[1],
        lng: hospital.location.coordinates[0],
      });
    }
    console.log('✅ Synchronisation des hôpitaux terminée');

    // 2. Ambulances
    const ambulances = await db.collection('ambulances').find().toArray();
    console.log(`🚑 ${ambulances.length} ambulances trouvées`);
    for (const ambulance of ambulances) {
      await session.run(`
        MERGE (a:Ambulance {id: $id})
        SET a.status = $status, a.latitude = $lat, a.longitude = $lng
      `, {
        id: ambulance._id.toString(),
        status: ambulance.status,
        lat: ambulance.location.coordinates[1],
        lng: ambulance.location.coordinates[0],
      });

      if (ambulance.hospitalId) {
        await session.run(`
          MATCH (a:Ambulance {id: $aid}), (h:Hospital {id: $hid})
          MERGE (a)-[:BELONGS_TO]->(h)
        `, {
          aid: ambulance._id.toString(),
          hid: ambulance.hospitalId.toString()
        });
      }
    }
    console.log('✅ Synchronisation des ambulances terminée');

    // 3. Urgences
    const emergencies = await db.collection('emergencies').find().toArray();
    console.log(`🚨 ${emergencies.length} urgences trouvées`);
    for (const emergency of emergencies) {
      await session.run(`
        MERGE (e:Emergency {id: $id})
        SET e.phoneNumber = $phoneNumber,
            e.latitude = $lat,
            e.longitude = $lng,
            e.status = $status
      `, {
        id: emergency._id.toString(),
        phoneNumber: emergency.phoneNumber,
        lat: emergency.location.coordinates[1],
        lng: emergency.location.coordinates[0],
        status: emergency.status || 'pending',
      });
    }
    console.log('✅ Synchronisation des urgences terminée');

    console.log('🎉 Synchronisation MongoDB → Neo4j terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur pendant la synchronisation :', error);
  } finally {
    await session.close();
    await neo4jDriver.close();
    await mongoClient.close();
    console.log('🔒 Connexions fermées proprement');
  }
}

export default syncMongoToNeo4j;
